import jwt from "jsonwebtoken";
import UserModel from "../../db/models/user_model.js";
import { AppError,catchError } from "../../utils/error_handler.js";
import redisClient from "../../db/redis_connection.js";

export const auth= (roles)=>{
    return catchError(async (req, res, next) => {
         if(roles.includes(req.user.role)){
            next();
        }else{
            throw new AppError('Unauthorized',401);
        }
    })
}

export const authorization = catchError(async(req, res, next) => {
    if (!req.headers.authorization) {
        throw new AppError('Unauthorized', 401);
    }
    
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        // check if the token is valid
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // check if the user is excist
        const user = await UserModel.findById(decoded.id);
        
        // check if the user is excist
        if (!user) {
            throw new AppError('Unauthorized', 401);
        }
        
        // store the user in the request object
        req.user = {
            id: user._id,
            role: user.role,
        };
        
        next();
    } catch (error) {
        // If token is expired and there's a refresh token in the request
        if (error.name === 'TokenExpiredError' && req.headers['refresh-token']) {
            try {
                const refreshToken = req.headers['refresh-token'];
                
                // Verify refresh token
                const decoded = jwt.verify(
                    refreshToken, 
                    process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY
                );
                
                // Check if refresh token exists in Redis
                const refreshTokenKey = `refresh_token:${decoded.id}`;
                const storedRefreshToken = await redisClient.get(refreshTokenKey);
                
                if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
                    throw new AppError('Invalid refresh token', 401);
                }
                
                // Get user info
                const user = await UserModel.findById(decoded.id);
                if (!user) {
                    throw new AppError('User not found', 404);
                }
                
                // Generate new tokens
                const accessToken = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.SECRET_KEY,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
                );
                
                // Update and issue new tokens
                res.set('Access-Token', accessToken);
                
                // Set user data in request
                req.user = {
                    id: user._id,
                    role: user.role,
                };
                
                next();
            } catch (refreshError) {
                throw new AppError('Invalid refresh token', 401);
            }
        } else {
            throw new AppError('Unauthorized or token expired', 401);
        }
    }
});