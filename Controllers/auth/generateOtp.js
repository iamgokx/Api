
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
  },
});


const sendOtpEmail = async (to, otp) => {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4CAF50; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Use the following OTP to complete your verification process:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #FF5733; background: #f8f8f8; padding: 10px 20px; border-radius: 5px; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">
          This OTP is valid for 10 minutes. Do not share it with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Your OTP Code",
      html: emailHtml, // Using HTML instead of plain text
    });

    console.log("📧 Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


module.exports = { sendOtpEmail, generateOtp };
