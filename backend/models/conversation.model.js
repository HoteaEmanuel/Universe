import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.path("participants").validate(function (value) {
  return value.length === 2;
}, "A conversation must have exactly 2 participants");

conversationSchema.index(
  { participants: 1 },
  {
    unique: true,
    partialFilterExpression: { participants: { $size: 2 } },
  }
);
export const Conversation = mongoose.model("Conversation", conversationSchema);
