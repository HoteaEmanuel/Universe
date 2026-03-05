import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const generateToken = async (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "15m",
  });

  // Save the acces token in a cookie that cannot be accesed by js
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 1000 * 60 * 15, // 15 minutes
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
  

  // Save the refresh token in a cookie for a longer duration
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Save refresh token in database
  const user=await User.findById(userId);
  user.refreshToken = refreshToken;
  await user.save();
  return token;
};
