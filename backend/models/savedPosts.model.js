import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    savedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

savedPostSchema.index({ user: 1, savedAt: -1 });
savedPostSchema.index({ user: 1, post: 1 }, { unique: true });
savedPostSchema.index({ post: 1 });
export const SavedPost = mongoose.model("SavedPost", savedPostSchema);
