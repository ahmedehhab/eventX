import joi from "joi";
import SYSTEMS_ROLE from "../../utils/systems_role.js";

/**
 * Sign up validation schema
 * Validates user registration data
 */
export const signUpSchema = joi.object({
  body: {
    username: joi.string().required().trim().min(3).max(30),
    email: joi.string().email().required().lowercase().trim(),
    password: joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|:;"\'<>,.?/~`]).{8,}$'))
      .message('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.')
      .required(),
    firstName: joi.string().required().trim().min(2).max(50),
    lastName: joi.string().required().trim().min(2).max(50),
    role: joi.string().valid(...Object.values(SYSTEMS_ROLE)).default(SYSTEMS_ROLE.USER)
  }
});

/**
 * Login validation schema
 * Validates login credentials
 */
export const loginSchema = joi.object({
  body: {
    identifier: joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Email or username is required'
      }),
    password: joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required'
      })
  }
});

/**
 * Email verification resend schema
 * Validates resend verification email request
 */
export const resendVerificationSchema = joi.object({
  body: {
    email: joi.string().email().required().lowercase().trim()
  }
});

/**
 * Forgot password schema
 * Validates forgot password request
 */
export const forgotPasswordSchema = joi.object({
  body: {
    email: joi.string().email().required().lowercase().trim()
  }
});

/**
 * Reset password validation schema
 * Validates password reset with code
 */
export const changePasswordSchema = joi.object({
  body: {
    email: joi.string().email().required().lowercase().trim(),
    resetCode: joi.string()
      .pattern(/^[0-9]{4}$/)
      .message('Reset code must be exactly 4 digits')
      .required(),
    newPassword: joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|:;"\'<>,.?/~`]).{8,}$'))
      .message('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.')
      .required()
  }
});

/**
 * Change password validation schema
 * Validates password change request for logged-in users
 */
export const resetPasswordSchema = joi.object({
  body: {
    email: joi.string().email().required().lowercase().trim(),
  }
});

/**
 * Refresh token validation schema
 * Validates refresh token request
 */
export const refreshTokenSchema = joi.object({
  body: {
    refreshToken: joi.string().required().messages({
      'string.empty': 'Refresh token is required'
    })
  }
});
