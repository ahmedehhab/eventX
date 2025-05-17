import joi from "joi";

export const createCategorySchema = joi.object({
  body: {
    name: joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Category name is required',
        'any.required': 'Category name is required'
      }),
    description: joi.string()
      .trim()
      .allow('', null)
      .messages({
        'string.base': 'Description must be a string'
      })
  }
});

export const getCategoryByIdSchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      })
  }
});

export const getAllCategoriesSchema = joi.object({
  query: {
    page: joi.number().integer().min(1).optional(),
    limit: joi.number().integer().min(1).max(100).optional(),
    sort: joi.string().optional(),
    fields: joi.string().optional(),
    search: joi.string().optional(),
    name: joi.string().optional(),
    slug: joi.string().optional(),
    eventCount: joi.number().integer().optional(),
    createdAt: joi.string().optional(),
    updatedAt: joi.string().optional()
  }
});

export const updateCategorySchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      })
  },
  body: {
    name: joi.string()
      .trim()
      .optional()
      .messages({
        'string.base': 'Name must be a string'
      }),
    description: joi.string()
      .trim()
      .allow('', null)
      .optional()
      .messages({
        'string.base': 'Description must be a string'
      })
  }
});


export const deleteCategorySchema = joi.object({
  params: {
    id: joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      })
  }
});

