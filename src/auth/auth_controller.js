import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {nanoid} from "nanoid";
import {catchError,AppError} from "../../utils/error_handler.js";
import UserModel from "../../db/models/user_model.js";
import sendVerificationEmail from "../../utils/send_verification_email.js";
import sendResetCodeEmail from "../../utils/send_reset_code.js";
import cloudinaryConfig from "../../utils/cloudinary.js";
import redisClient from "../../db/redis_connection.js";
// @desc   Register a new user
// @route  POST /auth/signup
// @body   {firstName,lastName,username,email,password,role}
// @access Public
export const signUp=catchError(async (req,res)=>{
    const {firstName,lastName,username,email,password ,role}=req.body;

    // hash password
    const userData={
        firstName,
        lastName,
        username,
        email,
        password,
        ...(role&&{role})
    };

     
    // check if the user is excist
    const userExists=await UserModel.findOne({email});
    if(userExists){
       throw new AppError('User already exists',400);
    }
    
    //start session
    const session = await mongoose.startSession();
    session.startTransaction();
    req.session=session;
    
      if(req.file){
            const folder=`${process.env.MAIN_FOLDER}/user_profile/${nanoid(6)}`;
            //upload image to cloudinary
            const {public_id,secure_url}=await cloudinaryConfig().uploader.upload(req.file.path,{folder});
            req.folder=folder;
            userData.folder=folder;
            userData.profilePicture={
                public_id,
                secure_url
            };
        
      }
    // create user
    const user=await UserModel.create([userData],{session});
        
    //send verification email
    await sendVerificationEmail(req,user[0]);

    //commit transaction
    await session.commitTransaction();
    // console.log("ana henaa");
    //end the session
    session.endSession();

    res.json({
        user:{
            id:user[0]._id,
            firstName:user[0].firstName,
            lastName:user[0].lastName,
            username:user[0].username,
            email:user[0].email,
            role:user[0].role
        },
        message:"user create successfully"
    });

});

// @desc   Verify user email
// @route  GET /auth/verify/:token
// @params   {token}
// @access Public
export const verifyEmail= catchError(async (req,res)=>{
    const {token}=req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.VERIFY_KEY);
    // check if token expired
   
    // Find the user by ID
    const user = await UserModel.findById(decoded.id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Update user's email verification status
    user.isEmailVerified = true;

    // Save the updated user
    await user.save();

    res.json({
        message: 'Email verified successfully'
    });

});

//@desc   Login user
//@route  POST /auth/login
//@body   {email,password}
//@access Public

export const login = catchError(async (req, res) => {
    const { identifier, password } = req.body; // Accept email or username as identifier
    
    // Find user by email or username
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select('+password'); // Explicitly select password field if it's excluded by default
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }
    
    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
    
    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN_JWT || '30d' }
    );
    
    // Store refresh token in Redis
    const refreshTokenKey = `refresh_token:${user._id}`;
    await redisClient.set(
      refreshTokenKey, 
      refreshToken, 
      { EX: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) || 60 * 60 * 24 * 30 } // 30 days default
    );
    
    // Format user response data
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName, // If using a virtual getter in your model
      profilePicture: user.profilePicture,
      role: user.role
    };
    
    // Send response with both tokens
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      user: userData,
      accessToken,
      refreshToken
    });
  });


//@desc   Reset the verification link
//@route  POST /auth/resend-verification-link
//@body   {email}
//@access Public
export const resendVerificationEmail=catchError(async(req,res)=>{
    const {email}=req.body;
    
    // check if the user is excist
    const user=await UserModel.findOne({email});
    if(!user){
        throw new AppError('User not found',404);
    }

    // check if the user already verified
    if(user.isEmailVerified){
        throw new AppError('Email already verified',400);
    }

    // send email verification
    await sendVerificationEmail(req,user);

    res.json({
        message: 'Verification email sent'
    });
    
})


export const resetPassword=catchError(async(req,res)=>{
    const {email}=req.body;
      
    // check if the user is excist
    const user=await UserModel.findOne({email});
    if(!user){
        throw new AppError('User not found',404);
    }

    // generate reset code
    let resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    await sendResetCodeEmail(user, resetCode);
    resetCode=await bcrypt.hash(resetCode,+process.env.SALT_RESETCODE);

    const resetCodeCacheKey = `reset_code:${email}`;
     redisClient.set(resetCodeCacheKey,resetCode,{EX:process.env.RESET_CODE_EXPIRES_IN*60});
    // send reset code to user

    res.json({
        message: 'Reset code sent'
    });
  
    
});



export const changePassword =catchError(async(req,res)=>{
    const {resetCode,newPassword,email}=req.body;

    // check if the user is excist
    const user=await UserModel.findOne({email});
    if(!user){
        throw new AppError('User not found',404);
    }
    
    // check if the reset code is correct
    const resetCodeCacheKey = `reset_code:${email}`;
    
    const cachedResetCode = await redisClient.get(resetCodeCacheKey);
    if (!await bcrypt.compare(resetCode, cachedResetCode)) {
        throw new AppError('Invalid reset code', 400);
    }
    
    // hash the new password
    user.password = newPassword;
    
    //save the user
    await user.save();
    await redisClient.del(resetCodeCacheKey);

    
    res.json({
        message: 'Password changed successfully'
    });
});

//@desc   Refresh access token
//@route  POST /auth/refresh-token
//@body   {refreshToken}
//@access Public
export const refreshToken = catchError(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }
  
  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY
    );
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
  
  // Check if refresh token exists in Redis
  const refreshTokenKey = `refresh_token:${decoded.id}`;
  const storedRefreshToken = await redisClient.get(refreshTokenKey);
  
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }
  
  // Find user
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Generate new access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
  
  // Generate new refresh token (token rotation for enhanced security)
  const newRefreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || process.env.SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN_JWT || '30d' }
  );
  
  // Update refresh token in Redis
  await redisClient.set(
    refreshTokenKey, 
    newRefreshToken, 
    { EX: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) || 60 * 60 * 24 * 30 }
  );
  
  res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken: newRefreshToken
  });
});

//@desc   Logout user
//@route  POST /auth/logout
//@body   {}
//@access Protected
export const logout = catchError(async (req, res) => {
  const userId = req.user.id;
  
  // Remove refresh token from Redis
  const refreshTokenKey = `refresh_token:${userId}`;
  await redisClient.del(refreshTokenKey);
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});