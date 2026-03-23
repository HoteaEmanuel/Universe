import { Follow } from "../models/follow.model.js";
export const findFollow = async (data) => {
  const { authUserId, followerId } = data;
  const follow = await Follow.findOne({
    follower: authUserId,
    following: followerId,
  });

  return follow;
};

export const createFollow = async (data) => {
  const { authUserId, followerId } = data;
  const follow = await Follow.create({
    follower: authUserId,
    following: followerId,
  });
  return follow;
};

export const deleteFollow = async (data) => {
  const { authUserId, unfollowerId } = data;
  await Follow.deleteOne({ follower: authUserId, following: unfollowerId });
};
