import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    eventCount: {
      type: Number,
      default: 0
    },
    image:[{
      public_id:{
        type:String,
        required:true,
        unique:true
      },
      secure_url:{
        type:String,
        required:true
      }
    }],
    folder:{
      type:String,
      required:true,
      unique:true
    }
  }, {
    timestamps: true
  });

CategorySchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
})
  const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;