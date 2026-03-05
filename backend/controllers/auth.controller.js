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
import { emailQueue } from "../queues/emailQueue.js";
import { generateJwtMobile } from "../utils/generateJwtMobile.js";

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

export const signUp = async (req, res) => {

  let { firstName, lastName, name, email, password, accountType, major } =
    req.body;

  console.log(firstName, lastName, name, email, password, accountType, major);
  console.log("SIGN UP REQUEST: ", req.body);
  try {
    email = email.toLowerCase();
    if (
      RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$").test(
        email,
      ) === false
    ) {
      console.log("INVALID");
      return res
        .status(400)
        .json({ succes: false, message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: email });
    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "Registration failed!" });
    }
    // if (!firstName || !lastName || !email || !password || !accountType || (accountType === "normal" && !major)) {
    //   return res
    //     .status(400)
    //     .json({ succes: "Failure", message: "All the field are required" });
    // }
    console.log("ABOVE DOMAIN");
    const domain = email.split("@")[1];
    console.log("DOMAIN");
    console.log(domain);
    const domainValid = universityEmailDomains.find(
      (Unidomain) => Unidomain == domain,
    );
    if (domainValid === undefined) {
      return res
        .status(400)
        .json({ succes: false, message: "Not a university email" });
    }
    const universityName = universityDomains[domain];

    const verificationCode = generateVerificationToken();

    // Generate salt and hash

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    let user;
    if (accountType === "normal") {
      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        university: universityName,
        major: major || "",
        verificationToken: verificationCode,
        identityVerified: true,
        accountType: accountType,
        verificationTokenExpiresAt: Date.now() + 1000 * 60 * 15,
      });
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        university: name,
        verificationToken: verificationCode,
        accountType: accountType,
        verificationTokenExpiresAt: Date.now() + 1000 * 60 * 15,
      });
    }
    // Generate the JWT Token
    generateToken(res, user._id);
    // await sendEmail(user.email, verificationCode);
    await emailQueue.add("sendVerificationEmail", {
      to: user.email,
      subject: "Verify your email",
      body: verificationCode,
    });
    await user.save();
    console.log("USER CREATED: ", user);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Could not create user" });
  }
};

export const sendVerificationEmail = async (req, res) => {
  const data = req.body;
  const { email } = data;
  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        message: "Something went wrong.",
      });
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This email is already verified" });
    }
    const verificationCode = generateVerificationToken();
    user.verificationToken = verificationCode;
    user.verificationTokenExpiresAt = Date.now() + 1000 * 60 * 15;
    await user.save();
    await sendEmail(email, verificationCode);
    return res
      .status(200)
      .json({ message: "Verification email was sent successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Verification email process failed" });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    const user = await User.findOne({ verificationToken: verificationCode });
    if (!user) {
      throw new Error("Verification code is wrong");
    }
    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < Date.now()
    ) {
      return res.status(400).json({ message: "Verification code is expired" });
    }
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    user.isVerified = true;
    await user.save();
    await sendWelcomeEmail(user);
    return res.status(200).json({ message: "Email verified :)" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Verification process went wrong!" });
  }
};

const login = async (req, res) => {
  console.log("LOGIN REQUEST: ", req.body);
  const { email, password } = req.body;
  const userExists = await User.findOne({ email: email });
  if (
    !userExists ||
    !userExists.isVerified ||
    (userExists.accountType === "business" &&
      userExists.identityVerified === "rejected") ||
    (userExists.accountType === "business" &&
      userExists.identityVerified == "false")
  ) {
    console.log("PROBLEM");
    throw new Error("Authentication failed");
  }
  const hashedPassword = userExists.get("password");
  const passwordsMatch = await bcryptjs.compare(password, hashedPassword);
  if (!passwordsMatch) {
    console.log("PASSWORDS DO NOT MATCH");
    throw new Error("Authentication failed");
  }

  userExists.lastLogin = new Date();
  await userExists.save();
  userExists.password = undefined;
  userExists.resetPasswordToken = undefined;
  userExists.resetPasswordExpiresAt = undefined;
  userExists.verificationToken = undefined;
  userExists.verificationTokenExpiresAt = undefined;
  return userExists;
};

export const loginWeb = async (req, res) => {
  try {
    const userExists = await login(req, res);
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
    const userExists = await login(req, res);

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Could not find user with provided email" });
    }

    const resetPassToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = await bcryptjs.hash(resetPassToken, 10);

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await sendPasswordResetEmail(user.email, hashedToken);
    return res
      .status(200)
      .json({ message: "Reset password email was sent with succes!" });
  } catch (error) {
    return res.status(400).json({ message: "Couldnt reset password" });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const decodedToken = decodeURIComponent(token);
    const user = await User.findOne({ resetPasswordToken: decodedToken });
    if (!user) {
      throw new Error("Something went wrong");
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed succesfully" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
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
