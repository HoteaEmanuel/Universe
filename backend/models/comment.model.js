import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refs: "User",
    index: true,
  },
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refs: "Post",
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});
export const Comment = mongoose.model("Comment", commentSchema);
