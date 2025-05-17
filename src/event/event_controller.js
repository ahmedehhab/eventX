import { nanoid } from "nanoid";
import EventModel from "../../db/models/event_model.js";
import parseCustomDate from "../../utils/parse_custome_date.js";
import { catchError,AppError } from "../../utils/error_handler.js";
import cloudinaryConfig from "../../utils/cloudinary.js";
import getKeysModel from "../../utils/get_keys_model.js";
import ApiFeatures from "../../utils/api_features.js";
import deleteFolderCloud from "../../utils/delete_folder_cloud.js";

export const createEvent = catchError(async (req, res) => {
    let {
        name,
        description,
        startDate,
        endDate,
        venue,
        ticketPricing,
        totalTickets
    } = req.body;

    const organizer = req.user.id;
    const { categoryId } = req.params;

    startDate = parseCustomDate(startDate);
    endDate = parseCustomDate(endDate);

    if (startDate > endDate) {
        throw new AppError("Start date must be before end date", 400);
    }

    let coverImage;
    let additionalImages = [];

    // Upload cover image (only one expected)
    if (req.files?.coverImage?.length) {
        const folder = `${process.env.MAIN_FOLDER}/event/coverImage/${nanoid(6)}`;
        const file = req.files.coverImage[0];
        const image = await cloudinaryConfig().uploader.upload(file.path, { folder });

        coverImage = {
            public_id: image.public_id,
            secure_url: image.secure_url,
            folder
        };
        req.folder = folder;
    }

    // Upload additional images in parallel
    if (req.files?.additionalImages?.length) {
        const folder = `${process.env.MAIN_FOLDER}/event/additionalImages/${nanoid(6)}`;
        const uploadPromises = req.files.additionalImages.map(file =>
            cloudinaryConfig().uploader.upload(file.path, { folder })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        additionalImages = uploadedImages.map(img => ({
            public_id: img.public_id,
            secure_url: img.secure_url,
            folder
        }));

        req.folder = folder;
    }

    // Create the event
    const event = await EventModel.create({
        name,
        description,
        startDate,
        endDate,
        venue,
        ticketPricing,
        totalTickets,
        organizer,
        coverImage,
        additionalImages,
        category: categoryId
    });

    res.status(201).json({ message: "Event created successfully", event });
});


export const getAllEvents=catchError(async (req,res)=>{
 const fields=getKeysModel(EventModel);
 const apiFeatures=new ApiFeatures(EventModel.find(),req.query).paginate().limitFields().sort().search().filter(fields);
 const events=await apiFeatures.MongooseQuery;
 res.status(200).json({
    success:true,
    message:"Events fetched successfully",
    data:events
 });
});

export const getEventById=catchError(async (req,res)=>{
    const {id}=req.params;
    const event=await EventModel.findById(id);
    if(!event){
        throw new AppError("Event not found",404);
    }
    res.status(200).json({
        success:true,
        message:"Event fetched successfully",
        data:event
    });
});

export const deleteEvent=catchError(async (req,res)=>{
    const {id}=req.params;
    const event=await EventModel.findByIdAndDelete(id);
    if(!event){
        throw new AppError("Event not found",404);
    }
    if(event.coverImage){
        await deleteFolderCloud(event.coverImage.folder);
    }
    if(event.additionalImages){
        await deleteFolderCloud(event.additionalImages.folder);
    }   
    res.status(200).json({
        success:true,
        message:"Event deleted successfully",
        data:event
    });
});

export const getEventsByCategory=catchError(async (req,res)=>{
    const {categoryId}=req.params;
    const events=await EventModel.find({category:categoryId});
    if(!events){
        throw new AppError("Events not found",404);
    }
    res.status(200).json({
        success:true,
        message:"Events fetched successfully",
        data:events
    });
});

export const getEventsByOrganizer=catchError(async (req,res)=>{
    const {organizerId}=req.params;
    const events=await EventModel.find({organizer:organizerId});
    if(!events){
        throw new AppError("Events not found",404);
    }
    res.status(200).json({
        success:true,
        message:"Events fetched successfully",
        data:events
    });
});


export const updateEvent=catchError(async (req,res)=>{
    const {id}=req.params;
    const {name,description,startDate,endDate,venue,ticketPricing,totalTickets}=req.body;
    const event=await EventModel.findById(id);
    if(!event){
        throw new AppError("Event not found",404);
    }
    if(name) event.name=name;
    if(description) event.description=description;
    if(startDate) event.startDate=startDate;
    if(endDate) event.endDate=endDate;
    if(venue) event.venue=venue;
    if(ticketPricing) event.ticketPricing=ticketPricing;
    if(totalTickets) event.totalTickets=totalTickets;
    const updatedEvent=await event.save();
    res.status(200).json({
        success:true,
        message:"Event updated successfully",
        data:updatedEvent
    });
});