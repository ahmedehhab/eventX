import redis from "redis";

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("Redis connected");
});

export default redisClient;