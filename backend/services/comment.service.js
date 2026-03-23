import {
  CommentLike,
} from "../models/comment-likes.model.js";
import { Comment } from "../models/comment.model.js";
import { findPostById } from "../repository/post.repository.js";
export const createComment = async (data) => {
  const { id, userId, commentText } = data;
  const post = await findPostById(id);
  if (!post) throw new Error("The post doesnt exist");
  const comment = await Comment.create({
    postId: id,
    userId: userId,
    text: commentText,
  });
  return comment;
};

export const likeComment = async (data) => {
  const { commentId, userId } = data;
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  const like = await CommentLike.create({
    commentId: commentId,
    likedBy: userId,
  });
  return like;
};

export const removeCommentLike = async (commentId, userId) => {
  const commentLike = await CommentLike.findOneAndDelete({
    commentId,
    likedBy: userId,
  });
  if (!commentLike) throw new Error("Comment Like not found");
};
