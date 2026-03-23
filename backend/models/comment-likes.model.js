import mongoose from "mongoose";

const CommentLikeSchema=new mongoose.Schema({
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments",
        required:true
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
},
{
    timestamps:true
}); 
export const CommentLike=mongoose.model("comment-likes",CommentLikeSchema);