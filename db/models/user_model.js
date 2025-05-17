import mongoose from "mongoose";
import bcrypt from "bcrypt";
import SYSTEMS_ROLE from "../../utils/systems_role.js";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false 
  },

  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },

  role: {
    type: String,
    enum: Object.values(SYSTEMS_ROLE),
    default: SYSTEMS_ROLE.USER
  },
 
  bookedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  profilePicture:{
    public_id: {type:String,required:true,unique:true},
    secure_url: {type:String,required:true}
  },
  folder:{
    type:String,
    required:true,
    unique:true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,+process.env.SALT_ROUNDS);

});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
