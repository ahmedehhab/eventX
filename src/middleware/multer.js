import multer from "multer";
import allowedExtensions from "../../utils/allowExtensions.js";
import path from "path";
import fs from "fs";
import  { v4 as uuidv4 } from "uuid";

export const multerMiddleLocal =({extensions=allowedExtensions.image, filePath = 'general' })=>{
    const destinationPath=path.resolve(`src/uploads/${filePath}`);
    if(fs.existsSync(destinationPath)){
        fs.mkdir(destinationPath, { recursive: true })
    }

    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath)
        },
        filename: (req, file, cb) => {
            const uniqueFileName = uuidv4() + '_' + file.originalname;
            cb(null, uniqueFileName)
        }
    });
  const file =multer({fileFilter,storage });
  return file;
}


export const multerMiddleHost=({extensions=allowedExtensions.image})=>{

     const fileFilter=(req,file,cb)=>{
         if(extensions.includes(file.mimetype.split('/')[1])){
            return cb(null,true);
         }
         cb(new Error('Image format is not allowed!'), false);
     }
     
     const storage=multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFileName = uuidv4() + '_' + file.originalname;
            cb(null, uniqueFileName)
        }
     })

     const file=multer({fileFilter,storage});
     return file;
}