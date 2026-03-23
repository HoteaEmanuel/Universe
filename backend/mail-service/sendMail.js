import {
  RESET_PASSWORD_EMAIL,
  VERIFICATION_EMAIL,
  WELCOME_EMAIL,
} from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "emanuelhotea1@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
export const sendEmail = async (email, verificationCode) => {
  console.log("EMAIL SIGN UP: " + email);
  try {
    transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL.replace(
        "{{VERIFICATION_CODE}}",
        verificationCode,
      ),
    });
  } catch (error) {
    console.log("Email was not sent:( ");
  }
};
export const sendWelcomeEmail = async (user) => {
  try {
    transporter.sendMail({
      to: user.email,
      subject: "Welcome to Universe",
      html: WELCOME_EMAIL.replace("{{USER_NAME}}", user.name)
        .replaceAll("{{APP_NAME}}", "Universe")
        .replace("{{APP_URL}}", `${process.env.CLIENT_URL}/login`),
    });
  } catch (error) {
    console.log("Email was not sent:( ");
  }
};
export const sendPasswordResetEmail = async (data) => {
  const encodedToken = encodeURIComponent(data.token);
  const url = `${process.env.CLIENT_URL}/reset-password/${encodedToken}`;
  try {
    transporter.sendMail({
      to: data.email,
      subject: "Reset password",
      html: RESET_PASSWORD_EMAIL.replace("{{URL}}", url),
    });
  } catch (error) {
    console.log("Could not sent reset email");
  }
};
