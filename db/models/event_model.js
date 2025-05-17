import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
   
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    venue: {
      name: {
        type: String,
        required: true
      },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
      }
    },
  
    ticketPricing: [{
      type: {
        type: String,
        enum: ['Standard', 'VIP', 'Early Bird']
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      }
    }],
  
    totalTickets: {
      type: Number,
      required: true,
      min: 0
    },
   
  
    coverImage: {
      public_id: {type:String,required:true,unique:true},
      secure_url: {type:String,required:true},
      folder:{type:String,required:true}
    },
    additionalImages: [{
      public_id: {type:String,required:true,unique:true},
      secure_url: {type:String,required:true},
      folder:{type:String,required:true}
    }],
  
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Cancelled', 'Completed','Ended'],
      default: 'Draft'
    },
  
    bookingCount: {
      type: Number,
      default: 0
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

  EventSchema.post('find', function (docs) {
    const now = new Date();
    for (let doc of docs) {
      if (doc.endDate && doc.endDate < now && doc.status !== 'Ended') {
        doc.status = 'Ended'; 
      }
    }
  });
  EventSchema.post('find',function(docs){
    if(!this.totalTickets){
        this.status='Completed';
    }
  })

   
EventSchema.index({ startDate: 1, category: 1 });
const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;