import { populate } from "dotenv";
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actionUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["post-like", "follow"],
    },
    message: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    userAvatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", NotificationSchema);
