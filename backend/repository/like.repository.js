import { Like } from "../models/like.model.js";

export const findLikeByPostAndUser = async (postId, userId) => {
  const like = await Like.findOne({ userId: userId, postId: postId });
  return like;
};

export const createLike = async (postId, userId) => {
  const like = await Like.create({
    userId,
    postId,
  });
  return like;
};

export const deleteLike = async (postId, userId) => {
  await Like.deleteOne({ userId, postId });
};

export const deleteLikes = async (id) => {
  await Like.deleteMany({ postId: id });
};
