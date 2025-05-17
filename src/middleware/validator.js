import { catchError ,AppError } from "../../utils/error_handler.js";
const validator=(schema)=>{
    return catchError(async (req, res, next) => {
        
        const data={
            ...(Object.keys(req.body).length&&{body:req.body}),
            ...(Object.keys(req.query).length&&{query:req.query}),
            ...(Object.keys(req.params).length&&{params:req.params})
        };
        const { error } = schema.validate(data, { abortEarly: false });  
       if(error){
            const err=error.details.map(d=>d.message).join(" ");
               throw new AppError(err,401);
           }
            
           next();
    })
}
export default validator;
