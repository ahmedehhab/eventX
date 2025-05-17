import { resetCodeEmail } from "./email_fromat.js";
import sendEmail from "./send_email.js";


 const sendResetCodeEmail=async(user,code)=>{
  const emailFormat=resetCodeEmail(code);

  // sending the email to user 
  await sendEmail(user.email,'Reset Password',emailFormat);
}

export default sendResetCodeEmail;