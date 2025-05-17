import Router from "express";
import { signUp,
    verifyEmail,
    login,
    resendVerificationEmail,
    resetPassword,
    changePassword,
    refreshToken,
    logout
} from "./auth_controller.js";

import { signUpSchema,
    loginSchema,
    resendVerificationSchema,
    resetPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema
} from "./auth_validation.js";

import validator from "../middleware/validator.js";
import {multerMiddleHost} from "../middleware/multer.js";
import allowedExtensions from "../../utils/allowExtensions.js";
import rateLimiterMiddleware from "../middleware/rate_limiter_middleware.js";
import { authorization } from "../middleware/auth_middleware.js";
const router = Router();

router.post('/signup',rateLimiterMiddleware, multerMiddleHost({extensions:allowedExtensions.image}).single('image'), validator(signUpSchema), signUp);

router.post('/login', rateLimiterMiddleware, validator(loginSchema), login);   

router.get('/verify/:token',verifyEmail);

router.post('/resend-verification-email',rateLimiterMiddleware, validator(resendVerificationSchema),resendVerificationEmail);

router.post('/reset-password',rateLimiterMiddleware,validator(resetPasswordSchema), resetPassword);

router.post('/change-password', rateLimiterMiddleware, validator(changePasswordSchema), changePassword);

router.post('/refresh-token', rateLimiterMiddleware, validator(refreshTokenSchema), refreshToken);

router.post('/logout', rateLimiterMiddleware, authorization, logout);

export default router;
