import { io } from "../lib/socket.js";
import { CommentLike} from "../models/comment-likes.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import {
  createComment,
  likeComment,
  removeCommentLike,
} from "../services/comment.service.js";

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("COMMENTS", postId);
    const comments = await Comment.find({ postId: postId });
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        const isLiked = await CommentLikesModel.findOne({
          commentId: comment._id,
          likedBy: req.userId,
        });
        return {
          ...comment._doc,
          isLiked: !!isLiked,
        };
      }),
    );
    return res
      .status(200)
      .json({ message: "Success", comments: commentsWithLikes });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export const likeCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const data = { commentId, userId: req.userId };
    await likeComment(data);
    return res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const removeLikeCommentController = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
    await removeCommentLike(commentId, userId);
    return res
      .status(200)
      .json({ message: "Comment like removed successfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
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
export const sendCommentController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment: commentText } = req.body;
    const data = { id, userId, commentText };
    await createComment(data);
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
