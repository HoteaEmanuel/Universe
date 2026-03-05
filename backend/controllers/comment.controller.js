import { io } from "../lib/socket.js";
import { CommentLikesModel } from "../models/comment-likes.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("COMMENTS", postId);
    const comments = await Comment.find({ postId: postId });
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const isLiked = await CommentLikesModel.findOne({ 
          commentId: comment._id,
          likedBy: req.userId 
        }); 
        return {
          ...comment._doc,
          isLiked: !!isLiked,
        };
      })
    );
    return res.status(200).json({ message: "Success", comments: commentsWithLikes });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export const likeComment=async(req,res)=>{
  try {
    const commentId=req.params.id;
    const comment=await Comment.findById(commentId);
    if(!comment) throw new Error("Comment not found");
    const like=new CommentLikesModel({
        commentId:commentId,
        likedBy:req.userId
    });
    await like.save();
    return res.status(200).json({message:"Comment liked successfully"});
  } catch (error) {
    return res.status(400).json({error});
  }

}

export const removeLikeComment=async(req,res)=>{
  try {
    const commentId=req.params.id;
    const commentLike=await CommentLikesModel.findOneAndDelete({
        commentId:commentId,
        likedBy:req.userId  
    });
    if(!commentLike) throw new Error("Like not found");
    return res.status(200).json({message:"Comment like removed successfully"});
  } catch (error) {
    return res.status(400).json({error});
  }   
}
export const getCommentsCount = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id });
    return res
      .status(200)
      .json({ message: "Success", commentsCount: comments.length });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export const sendComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment: commentText } = req.body;
    const post = await Post.find({ id: id });
    if (!post) throw new Error("The post doesnt exist");
    const comment = new Comment({
      postId: id,
      userId: userId,
      text: commentText,
    });
    await comment.save();
    console.log("COMMENT ADAUGAT");
    // Add comment real time func
    // io.emit("newComment",comment);
    return res.status(201).json({ message: "Succes" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const deleteComment = async (req, res) => {
  console.log("TRYING TO DELETE");
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Deleted the comment successfully" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
