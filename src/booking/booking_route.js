import Router from "express";
import {auth,authorization} from "../middleware/auth_middleware.js";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
import validator from "../middleware/validator.js";
import { createBooking,
    getAllBookings,
    getUserBookings,
    getEventBookings,
    getBookingById,
    cancelBooking,
    updateAttendeeDetails,
    deleteBooking
    } from "./booking_controller.js";
    import {
        createBookingSchema,
        getBookingByIdSchema,
        getEventBookingsSchema,
        cancelBookingSchema,
        updateAttendeeDetailsSchema,
        deleteBookingSchema
        } from "./booking_validatoin.js";
const router=Router();

router.post('/create/:eventId',authorization,auth([SYSTEMS_ROLE.USER]),validator(createBookingSchema),createBooking);
router.get('/all',authorization,auth([SYSTEMS_ROLE.ADMIN]),getAllBookings);
router.get('/user',authorization,auth([SYSTEMS_ROLE.USER]),getUserBookings);
router.get('/event/:eventId',authorization,auth([SYSTEMS_ROLE.ADMIN,SYSTEMS_ROLE.ORGANIZER]),validator(getEventBookingsSchema),getEventBookings);
router.get('/:id',authorization,auth([SYSTEMS_ROLE.USER,SYSTEMS_ROLE.ADMIN]),validator(getBookingByIdSchema),getBookingById);
router.put('/cancel/:id',authorization,auth([SYSTEMS_ROLE.USER]),validator(cancelBookingSchema),cancelBooking);
router.put('/update/:id',authorization,auth([SYSTEMS_ROLE.USER]),validator(updateAttendeeDetailsSchema),updateAttendeeDetails);
router.delete('/:id',authorization,auth([SYSTEMS_ROLE.ADMIN]),validator(deleteBookingSchema),deleteBooking);

export default router;