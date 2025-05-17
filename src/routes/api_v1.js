import { Router } from "express";
import authRoute from "../auth/auth_route.js";
import eventRoute from "../event/event_route.js";
import userRoute from "../user/user_route.js";
import categoryRoute from "../category/category_route.js";
import bookingRoute from "../booking/booking_route.js";
const router = Router();


router.use('/auth',authRoute);
router.use('/event',eventRoute);
router.use('/user',userRoute);
router.use('/category',categoryRoute);
router.use('/booking',bookingRoute);
export default router;