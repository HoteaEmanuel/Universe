import { getActivePostUsers, io } from "../lib/socket.js";
import { CommentLike } from "../models/comment-likes.model.js";
import { Comment } from "../models/comment.model.js";
import { findPostById } from "../repository/post.repository.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { findUserById } from "../repository/user.repository.js";
import { createNotification } from "../repository/notification.repository.js";
export const createComment = async (data) => {
  const { id, userId, commentText } = data;
  const post = await findPostById(id);
  if (!post) throw new Error("The post doesnt exist");
  const comment = await Comment.create({
    postId: id,
    userId: userId,
    text: commentText,
  });

  const activePostUsers = getActivePostUsers(id);
  console.log("ACTIVE POST USERS: ", activePostUsers);

  // Send the real time comment to active users on that post
  if(activePostUsers){
  activePostUsers.forEach((user) =>
    io.to(getReceiverSocketId(user)).emit("newComment", comment),
  );
}
  // If the user that created the post is not on the post => send notification
  console.log(post.userId.toString());
  if (!activePostUsers.has(post.userId.toString())) {
    console.log("SEND NOTIF");
    const user = await findUserById(userId);
    const notifData = {
      actionUserId: userId,
      userId: post.userId,
      title: "New comment",
      type: "post-comment",
      message: `${user?.firstName || user?.name} commented on your post - ${commentText}!`,
    };
    const notification = await createNotification(notifData);

    console.log("CREATED NOTIF: ",notification);
    io.to(getReceiverSocketId(post.userId.toString())).emit(
      "newNotification",
      notification,
    );
    console.log("NOTIF WAS SENT");
  }

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
