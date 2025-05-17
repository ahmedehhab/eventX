import Joi from "joi";

export const updateUserSchema = Joi.object({
    body:{
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50),
        username: Joi.string().alphanum().min(3).max(30),
        email: Joi.string().email()
    }
});



export const userIdSchema = Joi.object({
    params:{
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    }
});