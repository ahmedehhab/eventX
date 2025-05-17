import { nanoid } from "nanoid";
import UserModel from "../../db/models/user_model.js";
import {catchError,AppError} from "../../utils/error_handler.js";
import cloudinaryConfig from "../../utils/cloudinary.js";
import ApiFeatures from "../../utils/api_features.js";
import getKeysModel  from "../../utils/get_keys_model.js";
import deleteFolderCloud from "../../utils/delete_folder_cloud.js";
export const updateUserProfile = catchError(async (req,res)=>{
    const {firstName,lastName,username,email}=req.body;
 
    const data ={
        ...(firstName&&{firstName}),
        ...(lastName&&{lastName}),
        ...(username&&{username}),
        ...(email&&{email})
    }

    const updateUser =await UserModel.findOneAndUpdate({ _id:req.user.id},data,{new:true});
    if(!updateUser){
         throw new AppError("User not found",404);
   };

   if(req.file){

    
    if(updateUser.folder){
        await deleteFolderCloud(updateUser.folder);
    }

    const folder=`${process.env.MAIN_FOLDER}/user_profile/${nanoid(6)}`;
    const {public_id,secure_url}=await cloudinaryConfig().uploader.upload(req.file.path,{folder});
    req.folder=folder;
    updateUser.profilePicture={
        public_id,
        secure_url
    }
    updateUser.folder=folder;
    
    };

    await updateUser.save();
    
    res.json({
        message:"User updated successfully",
        user:updateUser
    });
});

export const getUserProfile = catchError(async (req,res)=>{
    const {id}=req.user;
    const user = await UserModel.findById(id);
    if(!user){
        throw new AppError("User not found",404);
    }
    res.json({
        user
    });
});

export const getAllUsers=catchError(async(req,res)=>{
    const fields=getKeysModel(UserModel);
    const users= new ApiFeatures(UserModel.find(),req.query).paginate().limitFields().sort().search().filter(fields);
    const result=await users.MongooseQuery;
    res.json({
        success:true,
        message:"Users fetched successfully",
        data:result
    })
})  

export const deleteUser = catchError(async (req,res)=>{
    const {id}=req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if(!user){
        throw new AppError("User not found",404);
    }
    if(user.folder){
        await deleteFolderCloud(user.folder);
    }
    res.json({
        message:"User deleted successfully",
        user
    });
});



