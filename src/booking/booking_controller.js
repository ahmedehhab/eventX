import {AppError,catchError} from "../../utils/error_handler.js";
import BookingModel from "../../db/models/booking_model.js";
import EventModel from "../../db/models/event_model.js";
import UserModel from "../../db/models/user_model.js";
import getKeysModel from "../../utils/get_keys_model.js";
import ApiFeatures from "../../utils/api_features.js";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
export const createBooking = catchError(async (req, res) => {
    const { ticketType, quantity, totalPrice } = req.body;
    const userId = req.user?.id;
    const { eventId } = req.params;


    const event = await EventModel.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.totalTickets < quantity)
        throw new AppError("Not enough tickets available", 400);

    const now = new Date();
    if (now > event.endDate)
        throw new AppError("Event has already ended", 400);
    if (now > event.startDate)
        throw new AppError("Event has already started, cannot book anymore", 400);

    const booking = new BookingModel({ user: userId, event: event._id, ticketType, quantity, totalPrice });

    const user = await UserModel.findById(userId);
    user.bookedEvents.push(booking._id);
    event.totalTickets -= quantity;
    event.bookingCount += quantity;

    await Promise.all([event.save(), booking.save(), user.save()]);

    res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking
    });
});


export const getAllBookings = catchError(async (req, res) => {
    const fields = getKeysModel(BookingModel);
    const apiFeatures = new ApiFeatures(BookingModel.find().populate('event user'), req.query)
      .paginate()
      .limitFields()
      .sort()
      .search()
      .filter(fields);
  
    const bookings = await apiFeatures.MongooseQuery;
  
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings
    });
});


export const getUserBookings = catchError(async (req, res) => {
    const userId = req.user.id;
    
    const bookings = await BookingModel.find({ user: userId }).populate('event');
      
  
    res.status(200).json({
      success: true,
      message: "User bookings fetched successfully",
      data: bookings
    });
  });
  

export const getBookingById = catchError(async (req, res) => {
    const { id } = req.params;
    const booking = await BookingModel.findById(id).populate('event user');
    
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
      if (booking.user._id.toString() !== req.user.id.toString() && req.user.role !== SYSTEMS_ROLE.ADMIN) {
      throw new AppError("You are not authorized to view this booking", 403);
    }
  
    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking
    });
  });
  

  export const getEventBookings = catchError(async (req, res) => {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }
  
    if (event.organizer.toString() !== req.user.id.toString() && req.user.role !== SYSTEMS_ROLE.ADMIN) {
      throw new AppError("You are not authorized to view bookings for this event", 403);
    }
    
    const fields = getKeysModel(BookingModel);
    const apiFeatures = new ApiFeatures(
      BookingModel.find({ event: eventId }).populate('user'), 
      req.query
    )
      .paginate()
      .limitFields()
      .sort()
      .search()
      .filter(fields);
  
    const bookings = await apiFeatures.MongooseQuery;
  
    res.status(200).json({
      success: true,
      message: "Event bookings fetched successfully",
      data: bookings
    });
  });
  
 
  export const cancelBooking = catchError(async (req, res) => {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);
    
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    if (booking.user.toString() !== req.user.id.toString() ) {
      throw new AppError("You are not authorized to cancel this booking", 403);
    }
  
  
    const event = await EventModel.findById(booking.event);
    if (new Date(event.startDate) < new Date()) {
      throw new AppError("Cannot cancel booking for an event that has already started", 400);
    }
  
    await booking.save();
  
    const ticketTypeIndex = event.ticketPricing.findIndex(t => t.type === booking.ticketType);
    if (ticketTypeIndex !== -1) {
      event.ticketPricing[ticketTypeIndex].quantity += booking.quantity;
      await event.save();
    }
  
    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  });
  
 
  export const updateAttendeeDetails = catchError(async (req, res) => {
    const { id } = req.params;
    const { attendeeDetails } = req.body;
    
    const booking = await BookingModel.findById(id);
    
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
  
    if (booking.user.toString() !== req.user.id.toString() ) {
      throw new AppError("You are not authorized to update this booking", 403);
    }
  
    const event = await EventModel.findById(booking.event);
    if (new Date(event.startDate) < new Date()) {
      throw new AppError("Cannot update booking for an event that has already started", 400);
    }
  
    booking.attendeeDetails = attendeeDetails;
    await booking.save();
  
    res.status(200).json({
      success: true,
      message: "Attendee details updated successfully",
      data: booking
    });
  });
  
 
  export const deleteBooking = catchError(async (req, res) => {
    const { id } = req.params;
    
    if (req.user.role !== SYSTEMS_ROLE.ADMIN ) {
      throw new AppError("You are not authorized to delete bookings", 403);
    }
    
    // Find booking first before deleting it so we have all the information
    const booking = await BookingModel.findById(id);
    
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    
    // Return tickets to the event's available pool
    const event = await EventModel.findById(booking.event);
    if (event) {
      // Increase total tickets
      event.totalTickets += booking.quantity;
      // Decrease booking count
      if (event.bookingCount >= booking.quantity) {
        event.bookingCount -= booking.quantity;
      }
      
      // Return tickets to specific ticket type if it exists
      const ticketTypeIndex = event.ticketPricing?.findIndex(t => t.type === booking.ticketType);
      if (ticketTypeIndex !== -1) {
        event.ticketPricing[ticketTypeIndex].quantity += booking.quantity;
      }
      
      await event.save();
    }
    
    // Remove booking reference from user's bookedEvents
    await UserModel.findByIdAndUpdate(booking.user, {
      $pull: { bookedEvents: booking._id }
    });
    
    // Delete the booking
    await BookingModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: booking
    });
  });