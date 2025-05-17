import joi from "joi";

export const createBookingSchema = joi.object({
  body: {
    ticketType: joi.string()
      .required()
      .valid('Standard', 'VIP', 'Early Bird')
      .messages({
        'string.empty': 'Ticket type is required',
        'any.required': 'Ticket type is required',
        'any.only': 'Ticket type must be Standard, VIP, or Early Bird'
      }),
    quantity: joi.number()
      .required()
      .integer()
      .min(1)
      .max(10)
      .messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity cannot exceed 10',
        'any.required': 'Quantity is required'
      }),
    totalPrice: joi.number()
      .required()
      .min(0)
      .messages({
        'number.base': 'Total price must be a number',
        'number.min': 'Total price cannot be negative',
        'any.required': 'Total price is required'
      })
  },
  params: {
    eventId: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Event ID must be a valid MongoDB ObjectId',
        'any.required': 'Event ID is required'
      })
  }
});

export const getBookingByIdSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Booking ID must be a valid MongoDB ObjectId',
        'any.required': 'Booking ID is required'
      })
  }
});




export const getEventBookingsSchema = joi.object({
  params: {
    eventId: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Event ID must be a valid MongoDB ObjectId',
        'any.required': 'Event ID is required'
      })
  }
});

export const cancelBookingSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Booking ID must be a valid MongoDB ObjectId',
        'any.required': 'Booking ID is required'
      })
  }
});

export const updateAttendeeDetailsSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Booking ID must be a valid MongoDB ObjectId',
        'any.required': 'Booking ID is required'
      })
  },
  body: {
    attendeeDetails: joi.object()
      .required()
      .messages({
        'object.base': 'Attendee details must be an object',
        'any.required': 'Attendee details are required'
      })
  }
});

export const deleteBookingSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Booking ID must be a valid MongoDB ObjectId',
        'any.required': 'Booking ID is required'
      })
  }
});