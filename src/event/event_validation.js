import joi from "joi";

const venueSchema = joi.object({
  name: joi.string().required().trim().messages({
    'string.empty': 'Venue name is required',
    'any.required': 'Venue name is required'
  }),
  address: joi.object({
    street: joi.string().allow('', null).optional(),
    city: joi.string().allow('', null).optional(),
    state: joi.string().allow('', null).optional(),
    country: joi.string().allow('', null).optional(),
    zipCode: joi.string().allow('', null).optional()
  }).optional()
});

const ticketPricingSchema = joi.array().items(
  joi.object({
    type: joi.string().valid('Standard', 'VIP', 'Early Bird').required(),
    price: joi.number().min(0).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
    quantity: joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity cannot be negative',
      'any.required': 'Quantity is required'
    })
  })
);

export const createEventSchema = joi.object({
  body: {
    name: joi.string().required().trim().min(3).max(100).messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
    description: joi.string().required().trim().max(1000).messages({
      'string.max': 'Description cannot exceed 1000 characters',
      'string.empty': 'Description is required',
      'any.required': 'Description is required'
    }),
    startDate: joi.string().required().messages({
      'string.empty': 'Start date is required',
      'any.required': 'Start date is required'
    }),
    endDate: joi.string().required().messages({
      'string.empty': 'End date is required',
      'any.required': 'End date is required'
    }),
    venue: venueSchema.required(),
    ticketPricing: ticketPricingSchema.required(),
    totalTickets: joi.number().integer().min(0).required().messages({
      'number.base': 'Total tickets must be a number',
      'number.min': 'Total tickets cannot be negative',
      'any.required': 'Total tickets is required'
    }),
    status: joi.string().valid('Draft', 'Published', 'Cancelled', 'Completed', 'Ended').optional()
  },
  params: {
    categoryId: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      })
  }
 
});

export const getEventByIdSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Event ID must be a valid MongoDB ObjectId',
        'any.required': 'Event ID is required'
      })
  }
});

export const deleteEventSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Event ID must be a valid MongoDB ObjectId',
        'any.required': 'Event ID is required'
      })
  }
});

export const getEventsByCategorySchema = joi.object({
  params: {
    categoryId: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      })
  }
});

export const getEventsByOrganizerSchema = joi.object({
  params: {
    organizerId: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Organizer ID must be a valid MongoDB ObjectId',
        'any.required': 'Organizer ID is required'
      })
  }
});

export const updateEventSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Event ID must be a valid MongoDB ObjectId',
        'any.required': 'Event ID is required'
      })
  },
  body: {
    name: joi.string().trim().min(3).max(100).optional().messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    description: joi.string().trim().max(1000).optional().messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    startDate: joi.string().optional(),
    endDate: joi.string().optional(),
    venue: venueSchema.optional(),
    ticketPricing: ticketPricingSchema.optional(),
    totalTickets: joi.number().integer().min(0).optional().messages({
      'number.base': 'Total tickets must be a number',
      'number.min': 'Total tickets cannot be negative'
    }),
    status: joi.string().valid('Draft', 'Published', 'Cancelled', 'Completed', 'Ended').optional()
  }
});


