import { redis } from "../lib/redis.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { Follow } from "../models/follow.model.js";
import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { SavedPost } from "../models/savedPosts.model.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "firstName lastName _id profilePicture accountType university name",
    );
    return res.status(200).json(users);
  } catch (error) {}
};
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user) throw new Error("User not found");
    return res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const getUserByName = async (req, res) => {
  try {
    let { name } = req.params;
    name = name.replace(/-/g, " ").trim();
    const userWithName = await User.findOne({
      $or: [
        { name: new RegExp(`^${name}$`, "i") },
        {
          $expr: {
            $eq: [
              { $toLower: { $concat: ["$firstName", " ", "$lastName"] } },
              name.toLowerCase(),
            ],
          },
        },
      ],
    });
    if (!userWithName) throw new Error("User not found");
    return res.status(200).json({ message: "User found", user: userWithName });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const updateUserImage = async (req, res) => {
  const file = req.file;
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new Error("User not found");
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "users",
      resource_type: "image",
    });

    user.profilePicture = result.secure_url;
    await user.save();
    return res.status(200).json({ message: "Updated the image successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Updating the profile picture went wrong",
      error: error,
    });
  }
};
export const savePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found");

    const user = await User.findById(req.userId);
    if (!user) throw new Error("User not found");
    if (post.userId.equals(req.userId)) {
      throw new Error("Saving works only for other users posts");
    }
    const alreadySaved = await SavedPost.findOne({
      user: req.userId,
      post: id,
    });
    if (alreadySaved) {
      throw new Error("Already saved");
    }
    const savedPost = new SavedPost({
      user: req.userId,
      post: id,
    });
    await savedPost.save();
    return res.status(200).json({ message: "Saved the post" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Saving the post went wrong", error: error });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const post = await SavedPost.findOneAndDelete({ user: userId, post: id });
    return res.status(200).json({ message: "Post was unsaved" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const follow = async (req, res) => {
  try {
    const userId = req.userId;
    const followId = req.body.followId;
    const user = await User.findById(userId);
    const toFollowUser = await User.findById(
      followId,
      "firstName lastName _id name profilePicture",
    );
    const followedFromCache = await redis.get("followers-" + followId);
    const followingFromCache = await redis.get("following-" + userId);
    if (followingFromCache) await redis.del("following-" + userId);
    if (followedFromCache) await redis.del("followers-" + followId);
    if (!user || !toFollowUser) throw new Error("User not found");

    const alreadyFollowing = await Follow.findOne({
      follower: userId,
      following: followId,
    });

    if (alreadyFollowing) {
      throw new Error("Already following");
    }
    const follow = new Follow({
      follower: userId,
      following: followId,
    });

    const notification = await Notification.create({
      title: "New follow",
      message: `${user.firstName} started following you!`,
      userId: followId,
      actionUser: userId,
      type: "follow",
    });
    io.to(getReceiverSocketId(followId.toString())).emit(
      "newNotification",
      notification,
    );
    await notification.save();
    console.log("NOTIFICATION CREATED: ", notification);
    await follow.save();
    
    return res.status(200).json({ message: "Followed :)!" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const unfollow = async (req, res) => {
  try {
    const userId = req.userId;
    const unfollowId = req.body.unfollowId;
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);
    const followedFromCache = await redis.get("followers-" + unfollowId);
    const followingFromCache = await redis.get("following-" + userId);
    if (followingFromCache) await redis.del("following-" + userId);
    if (followedFromCache) await redis.del("followers-" + unfollowId);
    if (!user || !unfollowUser) throw new Error("User not found");
    const alreadyFollowing = await Follow.findOne({
      follower: userId,
      following: unfollowId,
    });
    if (!alreadyFollowing) {
      throw new Error("Not following");
    }

    console.log("THE USER THAT WILL BE UNFOLLOWED: ", unfollowUser);
    await Follow.deleteOne({ follower: userId, following: unfollowId });
    return res.status(200).json({ message: "Unfollowed!" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const getFollowers = async (req, res) => {
  console.log("FOLLOWERS ENDPOINTS HIT");
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    // const followersFromCache = await redis.get("followers-" + userId);

    // if (followersFromCache[0]) {
    //   console.log("FROM CACHE");
    //   return res.status(200).json({
    //     message: "Fetched the followers",
    //     followers: followersFromCache,
    //   });
    // }

    const followers = await Follow.find({ following: userId }).populate(
      "following",
      "profilePicture firstName lastName id",
    );
    console.log("FOLLOWERS FROM DB: ", followers);
    const data = followers.map((f) => f.follower);
    console.log("FOLLOWES  : ", data);
    await redis.set("followers-" + userId, JSON.stringify(data));
    return res.status(200).json({
      message: "Fetched the followers",
      followers: data,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const getFollowing = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const followingFromCache = await redis.get("following-" + userId);
    if (followingFromCache) {
      return res.status(200).json({
        message: "Fetched the following",
        following: followingFromCache,
      });
    }
    const following = await Follow.find({ follower: userId })
      .populate(
        "following",
        "profilePicture firstName lastName accountType university name _id",
      )
      .select("following");
    await redis.set(
      "following-" + userId,
      JSON.stringify(following.map((f) => f.following)),
    );
    return res.status(200).json({
      message: "Fetched the following",
      following: following.map((f) => f.following),
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const followsUser = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.id;
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);
    if (!user || !otherUser) throw new Error("No user found");
    const isFollowing = await Follow.findOne({
      follower: userId,
      following: otherUserId,
    });
    return res
      .status(200)
      .json({ message: "Check if its following", isFollowing });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const getUsersFromSameUniversity = async (req, res) => {
  try {
    const userId = req.userId;
    const authUser = await User.findById(userId);
    if (!authUser) throw new Error("User not found");
    const usersFromSameUniversity = await User.find({
      university: authUser.university,
      _id: { $ne: userId },
    }).select("firstName lastName profilePicture accountType _id university");
    return res.status(200).json({
      message: "Fetched users from same university",
      users: usersFromSameUniversity,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const updateBio = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.bio = bio;
    await user.save();
    return res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Updating bio went wrong", error: error });
  }
};
