import Router from "express";
import {multerMiddleHost} from "../middleware/multer.js";
import allowedExtensions from "../../utils/allowExtensions.js";
import {auth,authorization} from "../middleware/auth_middleware.js";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
import { 
    createCategory,
    getCategoryByid,
    getAllCategories,
    updateCategory,
    deleteCategory
 } from "./category_controller.js";

const router=Router();

router.post('/create',
    multerMiddleHost({extensions:allowedExtensions.image}).array('images',5),
    authorization,
    auth([SYSTEMS_ROLE.ADMIN]),
    createCategory
);
router.put('/update/:id',
    authorization,
    auth([SYSTEMS_ROLE.ADMIN]),
    updateCategory
);
router.get('/:id',getCategoryByid);

router.get('/',getAllCategories);

router.delete('/delete/:id',authorization,auth([SYSTEMS_ROLE.ADMIN]),deleteCategory);

export default router;