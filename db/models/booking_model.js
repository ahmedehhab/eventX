import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },  
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
  
    ticketType: {
      type: String,
      enum: ['Standard', 'VIP', 'Early Bird'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
  
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled'],
      default: 'Confirmed'
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
const BookingModel = mongoose.model("Booking", BookingSchema);
export default BookingModel;
