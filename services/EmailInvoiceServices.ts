import { EmailOptions } from "@/Interface/EmailServiceProps";
import axios from "axios";

export const EmailInvoiceServices = async ({to, subject, body, attachment}: EmailOptions) => {
   if(!to || !subject || !body || !attachment){
    throw new Error("Please Provide all field")
  }
  
  try {
    const res = await axios.post(`http://192.168.155.173:8000/sendmail`, { to, subject, body, attachment })
    
    if (res.status === 200) {
      console.log("SuccessFully Sent Mail to client and User")
      return res
    }
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}