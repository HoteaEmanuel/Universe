import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import { generateVerificationToken } from "../utils/generateVerificationCode.js";
import { generateToken } from "../utils/generateTokenJwt.js";
import { universityDomains } from "../utils/universityDomains.js";
import {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../mail-service/sendMail.js";
import { universityEmailDomains } from "../utils/universityDomain.js";
import { generateJwtMobile } from "../utils/generateJwtMobile.js";

import {
  login,
  verifyEmail,
  signUp,
  sendVerificationEmail,
  forgotPassword,
  resetPassword,
} from "../services/auth.service.js";

/**
 * Check if there is a user with a specific id, as parameter
 * @param {*} req
 * @param {*} res
 * @returns the user with the specified id
 */
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select(
        "-password -resetPasswordExpiresAt -resetPasswordToken -verificationToken -verificationTokenExpiresAt",
      )
      .lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    return res
      .status(200)
      .json({ succes: "true", message: "User is authenticated", user: user });
  } catch (error) {
    return res.status(401).json({ message: "Unauth" });
  }
};
/*
Gets the business registrations
*/
export const businessRegistrations = async (req, res) => {
  try {
    const users = await User.find({
      accountType: "business",
      identityVerified: "false",
    });
    return res.status(200).json({ succes: true, businessRegistrations: users });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not fetch business registrations" });
  }
};
/*
The admin accepts a registration
 */
export const acceptBusinessRegistration = async (req, res) => {
  console.log("ACCEPT");
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    const authUser = await User.findById(req.userId);
    // Check if the logged user is an admin
    if (authUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.log("ACCEPT 2");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.identityVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "Business account verified successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not verify business account" });
  }
};

export const rejectBusinessRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Verific daca utilizatorul autentificat este admin
    const authUser = await User.findById(req.userId);
    if (authUser.accountType !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    user.identityVerified = "rejected";
    await user.save();

    return res
      .status(200)
      .json({ message: "Business account rejected and deleted successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not reject business account" });
  }
};

export const signUpController = async (req, res) => {
  try {
    const user = await signUp(req.body);

    // Generate the JWT Token
    // generateToken(res, user._id);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const sendVerificationEmailController = async (req, res) => {
  const { email } = req.body;
  try {
    await sendVerificationEmail(email);
    return res
      .status(200)
      .json({ message: "Verification email was sent successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyEmailController = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    await verifyEmail(verificationCode);
    return res.status(200).json({ message: "Email verified :)" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const loginWeb = async (req, res) => {
  console.log("LOGIN HIT IN THIS WAY");
  try {
    const userExists = await login(req.body);
    generateToken(res, userExists._id);
    return res
      .status(200)
      .json({ message: "Logged in successfully", user: userExists });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Could not log in" });
  }
};

export const loginMobile = async (req, res) => {
  try {
    const userExists = await login(req.body);

    // Generate the acces and refresh token and sent them
    const { accessToken, refreshToken } = await generateJwtMobile(
      userExists._id,
    );

    return res.status(200).json({
      message: "Logged in successfully",
      user: userExists,
      accessToken: JSON.stringify(accessToken),
      refreshToken: JSON.stringify(refreshToken),
    });
  } catch (error) {
    console.log("EROAREA");
    return res.status(400).json({ message: "Could not log in" });
  }
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  console.log("CALL?");
  try {
    await forgotPassword(email);
    return res
      .status(200)
      .json({ message: "Reset password email was sent with succes!" });
  } catch (error) {
    return res.status(400).json({ message: "Couldnt reset password" });
  }
};

export const resetPasswordController = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    await resetPassword(password, token);
    return res.status(200).json({ message: "Password changed succesfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const authWithGoogle = async (req, res) => {
  console.log("GOOGLE AUTH CALLBACK");
  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: "Google authentication failed" });
  }
  generateToken(res, req.user._id);
  // Redirect la frontend cu token
  res.redirect(`${process.env.FRONTEND_URL}/`);
};

export const authWithGoogleMobile = async (req, res) => {
  const { code } = req.query;

  try {
    const redirect_uri =
      process.env.BACKEND_URL_1 + "/auth/google/mobile-callback";
    console.log("Received code:", code);
    console.log("Using redirect URI:", redirect_uri);
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const { access_token } = data;
    console.log("Received access token:", access_token);

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    const { email, name, picture, id: googleId } = userInfo.data;
    console.log("USER DATA: " + email + name + picture);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        googleId,
      });
    }
    console.log("USER IN DB: ", user);
    const token = await generateJwtMobile(user._id);

    const userData = encodeURIComponent(
      JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        university: user.university,
        major: user.major,
        bio: user.bio,
        accountType: user.accountType,
      }),
    );

    // const deepLink = `exp://192.168.1.129:8081/auth-callback?token=${token}&user=${userData}`;
    const deepLink = `exp://192.168.1.129:8081/--/auth-callback?token=${encodeURIComponent(token)}&user=${userData}`;
    console.log("Redirecting to deep link:", deepLink);
    res.redirect(deepLink);
  } catch (error) {
    console.error("Google auth error:", error);
    // Redirect la app cu eroare
    res.redirect("mobileapp://auth-callback?error=auth_failed");
  }
};
