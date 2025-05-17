import {rollbackDb,rollbackCloudinary} from "./roll_back.js";

const catchError = (fn)=>{
    return async (req,res,next) =>{
      // Promise.resolve(fn(req,res,next)).catch((err)=>next(err));
      try{
        await fn(req,res,next);
      }catch(err){
        next(err);
      }
    }
}
  
const globalErrorHandler = async (err, req, res, next) => {
req.rollbackMessages=[];
  if (req.session) {
    rollbackDb(req);
  }

  if (req.folder) {
   rollbackCloudinary(req);
  }

  res.status(err.statusCode || 500).json({
    message: err.message,
    rollbackErrors: req.rollbackMessages? req.rollbackMessages : undefined,
  });
};



// this calss is inherited from Error class and add the statusCode property to the error object
class AppError extends Error{
constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode;
}  
}




export {catchError,AppError,globalErrorHandler};