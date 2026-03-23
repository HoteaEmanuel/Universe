import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
  createNormalAccount,
  createUniversityAccount,
  findUserByEmail,
  findUserByPasswordResetToken,
  findUserByVerificationCode,
  saveUser,
  verifyUser,
} from "../repository/user.repository.js";
import { universityEmailDomains } from "../utils/universityDomain.js";
import { universityDomains } from "../utils/universityDomains.js";
import { generateVerificationToken } from "../utils/generateVerificationCode.js";
import {
  resetPasswordEmailQueue,
  verifyEmailQueue,
  welcomeEmailQueue,
} from "../queues/emailQueue.js";

export const login = async (body) => {
  const { email, password } = body;
  const userExists = await findUserByEmail(email);

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
  userExists.resetPasswordToken = undefined;
  userExists.resetPasswordExpiresAt = undefined;
  userExists.verificationToken = undefined;
  userExists.verificationTokenExpiresAt = undefined;
  await userExists.save();

  return userExists;
};

export const signUp = async (body) => {
  console.log("HEREEE");
  let { firstName, lastName, name, email, password, accountType, major } = body;
  if (!firstName || !lastName || !email || !password || !accountType)
    throw new Error("All fields are required");
  email = email.toLowerCase();
  if (
    RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$").test(email) ===
    false
  ) {
    throw new Error("Invalid email format");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    console.log("USER EXISTS");
    throw new Error("Registration failed");
  }

  const domain = email.split("@")[1];
  const domainValid = universityEmailDomains.find(
    (Unidomain) => Unidomain == domain,
  );
  if (domainValid === undefined) {
    throw new Error("Not a university email");
  }
  const universityName = universityDomains[domain];

  const verificationCode = generateVerificationToken();

  // Generate salt and hash

  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);
  let user;

  // Creating the account
  if (accountType === "normal") {
    // Normal account
    const body = {
      firstName,
      lastName,
      email,
      universityName,
      hashedPassword,
      accountType,
      verificationCode,
      major,
    };
    user = await createNormalAccount(body);
  } else {
    // University account
    const body = {
      name,
      email,
      hashedPassword,
      universityName,
      verificationCode,
      accountType,
    };
    user = await createUniversityAccount(body);
  }

  // Generate the JWT Token
  //   generateToken(res, user._id);
  //   await sendEmail(email, verificationCode);
  await verifyEmailQueue.add("sendVerificationEmail", {
    to: user.email,
    subject: "Verify your email",
    body: verificationCode,
  });

  return user;
};

export const verifyEmail = async (code) => {
  const user = await findUserByVerificationCode(code);
  if (!user) {
    throw new Error("Verification code is wrong");
  }
  if (
    user.verificationCodeExpiresAt &&
    user.verificationCodeExpiresAt < Date.now()
  ) {
    throw new Error("Verification code is expired, try again!");
  }
  await verifyUser(code);
  const data = {
    email: user.email,
    name: user?.firstName || user?.name,
  };
  await welcomeEmailQueue.add("sendWelcomeEmail", data);
};

export const sendVerificationEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  if (user.isVerified) {
    throw new Error("User with provided email is already verified");
  }
  const verificationCode = generateVerificationToken();
  user.verificationCode = verificationCode;
  user.verificationCodeExpiresAt = Date.now() + 1000 * 60 * 15;
  await saveUser(user);
  await verifyEmailQueue.add("sendVerificationEmail", {
    to: user.email,
    subject: "Verify your email",
    body: verificationCode,
  });
};

export const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found with provided email");
  }

  const resetPassToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = await bcryptjs.hash(resetPassToken, 10);
  console.log("HASHED TOKEN: ", hashedToken);
  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000;

  await user.save();
  const encodedToken=encodeURIComponent(hashedToken);
  await resetPasswordEmailQueue.add("resetPasswordEmail", {
    email,
    token: encodedToken,
  });
};

export const resetPassword = async (password, token) => {
  const user = await findUserByPasswordResetToken(token);
  if (!user) {
    throw new Error("Something went wrong");
  }
  
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  user.password = hashedPassword;
  await saveUser(user);

};
export const loginWeb = async (body) => {
  const user = await login(body);
  if (!user) throw new Error("Login failed");

  //  generateToken(res, userExists._id);
};
