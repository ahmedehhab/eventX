import cloudinaryConfig from "./cloudinary.js";
export const rollbackDb=async(req)=>{
    if(req.session){
        try {
            await req.session.abortTransaction();
            await req.session.endSession();
        } catch (error) {
           req.rollbackMessages.push(`DB rollback failed: ${error.message}`);
        }
    }
}

export const rollbackCloudinary=async(req)=>{
    if(req.folder){
        try {
            const cloud = cloudinaryConfig();
            await cloud.api.delete_resources_by_prefix(req.folder);
            await cloud.api.delete_folder(req.folder);
        } catch (error) {
            req.rollbackMessages.push(`Cloudinary rollback failed: ${error.message}`);
        }
    }
}
