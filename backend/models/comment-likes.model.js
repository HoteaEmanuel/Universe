import mongoose from "mongoose";

const CommentLikes=mongoose.Schema({
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
export const CommentLikesModel=mongoose.model("comment-likes",CommentLikes);