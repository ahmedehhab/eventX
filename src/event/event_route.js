import Router from "express";
import {multerMiddleHost} from "../middleware/multer.js";
import allowedExtensions from "../../utils/allowExtensions.js";
import { auth, authorization } from "../middleware/auth_middleware.js";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
import {
    createEvent,
    deleteEvent,
    getEventById,
    getAllEvents,
    getEventsByCategory,
    getEventsByOrganizer,
    updateEvent
} from "./event_controller.js";
import {
    createEventSchema,
    getEventByIdSchema,
    getEventsByCategorySchema,
    updateEventSchema,
    deleteEventSchema,
    getEventsByOrganizerSchema
} from "./event_validation.js";
import validator from "../middleware/validator.js";

const router=Router();

router.post('/create/:categoryId',multerMiddleHost({extensions:allowedExtensions.image}).fields([
    {name:'coverImage',maxCount:1},
    {name:'additionalImages',maxCount:5}
]),validator(createEventSchema),authorization,auth([SYSTEMS_ROLE.ORGANIZER]),createEvent);

router.put('/update/:id',validator(updateEventSchema),authorization,auth([SYSTEMS_ROLE.ORGANIZER,SYSTEMS_ROLE.ADMIN]),updateEvent);

router.delete('/delete/:id',validator(deleteEventSchema),authorization,auth([SYSTEMS_ROLE.ORGANIZER,SYSTEMS_ROLE.ADMIN]),deleteEvent);

router.get('/get/:id',validator(getEventByIdSchema), getEventById);

router.get('/get-all', getAllEvents);

router.get('/get-by-category/:categoryId',validator(getEventsByCategorySchema), getEventsByCategory);

router.get('/get-by-organizer/:organizerId',validator(getEventsByOrganizerSchema),getEventsByOrganizer);

export default router;