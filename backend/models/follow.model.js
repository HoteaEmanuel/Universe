import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
followerSchema.index({ follower: 1, following: 1 }, { unique: true });
export const Follow = mongoose.model("Follow", followerSchema);
