import { User } from "../models/user.model.js";

export const findUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

export const findUserByVerificationCode = async (code) => {
  const user = await User.findOne({ verificationCode: code });

  console.log("USEr :", user);
  return user;
};

export const findUserByName = async (name) => {
  const user = await User.findOne({ name: name });
  return user;
};

export const findUserByPasswordResetToken = async (token) => {
  const user = await User.findOne({ resetPasswordToken: token });
  return user;
};

export const verifyUser = async (code) => {
  const user = await findUserByVerificationCode(code);
  user.verificationCode = null;
  user.verificationCodeExpiresAt = null;
  user.isVerified = true;
  await user.save();
  return user;
};

export const createNormalAccount = async (body) => {
  console.log("USER CREATED");
  let {
    firstName,
    lastName,
    email,
    hashedPassword,
    accountType,
    universityName,
    verificationCode,
    major,
  } = body;

  console.log(
    firstName,
    lastName,
    email,
    hashedPassword,
    accountType,
    universityName,
    verificationCode,
    major,
  );
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    university: universityName,
    major: major || "",
    verificationCode: verificationCode,
    identityVerified: true,
    accountType: accountType,
    verificationCodeExpiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
  });

  return user;
};

export const createUniversityAccount = async (body) => {
  const {
    name,
    email,
    hashedPassword,
    universityName,
    verificationCode,
    accountType,
  } = body;
  const user = new User({
    name,
    email,
    password: hashedPassword,
    university: universityName,
    verificationCode: verificationCode,
    accountType: accountType,
    verificationCodeExpiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
  });
  return user;
};

export const saveUser = async (user) => {
  await user.save();
};
