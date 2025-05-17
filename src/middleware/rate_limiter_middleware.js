import { catchError } from '../../utils/error_handler.js';
import redisClient from '../../db/redis_connection.js'; 

const rateLimiterMiddleware = catchError(async (req, res, next) => {
  const ip = req.ip;
  const reqKey = `ratelimit:${ip}`;
  const blockKey = `ratelimit-blocked:${ip}`;

  const limit = 19;
  const windowSeconds = 60;
  const blockDuration = 300; 

  const isBlocked = await redisClient.get(blockKey);
  if (isBlocked) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests. You are temporarily blocked for 5 minutes.'
    });
  }

  const current = await redisClient.get(reqKey);

  if (current && parseInt(current) >= limit) {
    await redisClient.setEx(blockKey, blockDuration, '1');
    await redisClient.del(reqKey);

    return res.status(429).json({
      status: 'error',
      message: 'Too many requests. You are temporarily blocked for 5 minutes.'
    });
  }

  if (!current) {
    await redisClient.setEx(reqKey, windowSeconds, '1');
  } else {
    await redisClient.incr(reqKey);
  }

  next();
});

export default rateLimiterMiddleware;
