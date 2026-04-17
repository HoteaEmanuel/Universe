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
      enum: ["post-like", "post-comment","follow","message"],
    },
    message: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    conversationId:{
      type:mongoose.Schema.Types.ObjectId,
    },
    groupId:{
      type:mongoose.Schema.Types.ObjectId,
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
