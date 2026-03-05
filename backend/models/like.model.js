import mongoose from "mongoose";
const likeSchema = new mongoose.Schema(
  {
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Post",
        index:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        index:true
    }
  },
  { timestamps: true }
);
likeSchema.index({userId:1,postId:1},{unique:true});
export const Like= mongoose.model("Like", likeSchema);
