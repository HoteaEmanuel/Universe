import mongoose, { mongo } from "mongoose";
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    imagesUrls: {
      type: [String],
    },
    imagesPublicIds: {
      type: [String],
    },
    title:{
      type: String,
      required: true,
    },
    body:{
      type: String,
    },
    location: {
      type: String,
    },
    tags: {
      type: [String],
      ref: "Tag",
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const Post = mongoose.model("Post", postSchema);
