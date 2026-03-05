import { timeStamp } from "console";
import mongoose from "mongoose";

const groupMessageModel = mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
export const GroupMessage = mongoose.model("GroupMessage", groupMessageModel);
