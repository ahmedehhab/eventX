const deleteFolderCloud=async(folder)=>{
    try {
        await cloudinaryConfig().api.delete_resources_by_prefix(folder);
        await cloudinaryConfig().api.delete_folder(folder);
    } catch (error) {
        console.log(error);
    }
}

export default deleteFolderCloud;