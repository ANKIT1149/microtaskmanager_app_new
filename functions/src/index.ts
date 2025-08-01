import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

const EMAIL_ADDRESS = functions.config().email.address;
const EMAIL_PASSWORD = functions.config().email.password;

export const emailInvoice = functions.https.onCall(async (data: any, context: any) => {
  const { to, subject, body, attachment } = data;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Microtasker" <${EMAIL_ADDRESS}>`,
    to,
    subject,
    text: body,
    attachments: attachment ? [
      {
        filename: 'invoice.pdf',
        path: attachment
      }
    ] : []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Failed to send email", error);
    throw new functions.https.HttpsError('internal', 'Error in sending email');
  }
});
