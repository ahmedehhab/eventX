import { Router } from "express";

import validator from "../middleware/validator.js";
import {multerMiddleHost} from "../middleware/multer.js";
import allowedExtensions from "../../utils/allowExtensions.js";
import {auth,authorization} from "../middleware/auth_middleware.js";
import rateLimiterMiddleware from "../middleware/rate_limiter_middleware.js";
import { 
    updateUserProfile,
    getUserProfile,
    getAllUsers,
    deleteUser
 } from "./user_controller.js";
 import {
    updateUserSchema,
    userIdSchema
} from "./user_validation.js";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
const router=Router();

router.put('/update-profile',
    rateLimiterMiddleware,
    multerMiddleHost({extensions:allowedExtensions.image}).single('image'),
    authorization,
    validator(updateUserSchema),
    updateUserProfile
);

router.get(
    '/profile',
    authorization,
    getUserProfile
)
router.get(
    '/',
    authorization,
    auth([SYSTEMS_ROLE.ADMIN]),
    getAllUsers
)
router.delete(
    '/delete/:id',
    authorization,
    auth([SYSTEMS_ROLE.ADMIN]),
    validator(userIdSchema),
    deleteUser
)



export default router;