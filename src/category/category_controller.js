import categoryModel from "../../db/models/category_model.js";
import { catchError,AppError } from "../../utils/error_handler.js";
import { nanoid } from "nanoid";
import cloudinaryConfig from "../../utils/cloudinary.js";
import ApiFeatures from "../../utils/api_features.js";
import getKeysModel  from "../../utils/get_keys_model.js";
import deleteFolderCloud from "../../utils/delete_folder_cloud.js";
export const createCategory=catchError(async(req,res)=>{
    const {name,description}=req.body;

    const category=new categoryModel({name,description});

    if(req.files){
        const folderId=nanoid(6);
        const folder=`${process.env.MAIN_FOLDER}/category/${folderId}`;
        for(const file of req.files){
            const image=await cloudinaryConfig().uploader.upload(file.path,{folder});
            category.image.push({
                public_id:image.public_id,
                secure_url:image.secure_url
            })
        }
        category.folder=folder;
        req.folder=folder;
    }

    const savedCategory=await category.save();

    res.status(201).json({
        success:true,
        message:"Category created successfully",
        data:savedCategory
    })
});


export const  getCategoryByid=catchError(async(req,res)=>{
    const {id}=req.params;
    const category=await categoryModel.findById(id);
    if(!category){
        throw new AppError("Category not found",404);
    }
    res.json({
        success:true,
        message:"Category fetched successfully",
        data:category
    })
});


export const getAllCategories=catchError(async(req,res)=>{
    const fields=getKeysModel(categoryModel);
    const categories= new ApiFeatures(categoryModel.find(),req.query).paginate().limitFields().sort().search().filter(fields);
    const result=await categories.MongooseQuery;
    res.json({
        success:true,
        message:"Categories fetched successfully",
        data:result
    })
});

export const updateCategory=catchError(async(req,res)=>{
    const {id}=req.params;
    const {name,description}=req.body;
    const category=await categoryModel.findById(id);
    if(!category){
        throw new AppError("Category not found",404);
    }
   if(name) category.name=name;
    if(description) category.description=description;

    const updatedCategory=await category.save();
    res.json({
        success:true,
        message:"Category updated successfully",
        data:updatedCategory
    })
})


export const deleteCategory=catchError(async(req,res)=>{
    const {id}=req.params;
    const category=await categoryModel.findByIdAndDelete(id);
    if(!category){
        throw new AppError("Category not found",404);
    }
    if(category.folder){
        await deleteFolderCloud(category.folder);
    }
    res.json({
        success:true,
        message:"Category deleted successfully",
        data:category
    })
})