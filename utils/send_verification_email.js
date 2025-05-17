import jwt from "jsonwebtoken";
import sendEmail from "./send_email.js";
import { emailVerification } from "./email_fromat.js";
const sendVerificationEmail= async(req,user)=>{
    //create token to verify the email
    const token = await jwt.sign({id:user._id},process.env.VERIFY_KEY,{expiresIn:'30m'});

    //get the domain automatically
    const domain = `${req.protocol}://${req.get('host')}`; 
    const verifyLink = `${domain}/auth/verify/${token}`;
    // create the email format
    const emailFormat=emailVerification(verifyLink);

    // sending the email to user 
    await sendEmail(user.email,'Verify your email',emailFormat);
}

export default sendVerificationEmail;
