import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
      required: false,
      // validate: {
      //   validator: (v) =>
      //     !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v),
      //   message: (props) => `${props.value} is not a valid URL`,
      // },
    },
    university: {
      type: String,
      required: false,
    },
    major: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    accountType: {
      type: String,
      enum: ["normal", "business"],
      default: "normal",
    },
    identityVerified: {
      type: String,
      default: "false",
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    refreshToken: String,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
