import { Post } from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import { SavedPost } from "../models/savedPosts.model.js";
import { Like } from "../models/like.model.js";
import { Tag } from "../models/tag.model.js";
import { Follow } from "../models/follow.model.js";
import { redis } from "../lib/redis.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { Notification } from "../models/notification.model.js";
// import { createDiffieHellmanGroup } from "crypto";
export const getPost = async (req, res) => {
  console.log("TRYING TO GET POST");
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found");
    const savedPost = await SavedPost.findOne({ user: req.userId, post: id });
    if (savedPost) post.isSaved = true;
    else post.isSaved = false;
    console.log("POST FOUND : " + post);
    return res.status(200).json({ message: "Succes", post: post });
  } catch (error) {
    return res.status(400).json({ message: "Error, no post found" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) throw new Error("User doesnt exist");
    const posts = await redis.get("user-posts-" + userId);
    if (posts) {
      return res.status(200).json({ message: "Fetched posts", posts });
    }
    const userPosts = await Post.find({ userId: userId }).sort({
      createdAt: -1,
    });
    await redis.set("user-posts-" + userId, JSON.stringify(userPosts));
    return res.status(200).json({ message: "Fetched posts", posts: userPosts });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) throw new Error("User doesnt exist");
    const savedposts = await SavedPost.find({ user: userId })
      .sort({ savedAt: -1 })
      .populate("post")
      .lean();
    const savedPosts = savedposts.map((sp) => sp.post);
    return res
      .status(200)
      .json({ message: "Fetched the saved posts", savedPosts });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const checkSaved = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const savedPost = await SavedPost.findOne({ user: userId, post: postId });
    const isSaved = savedPost ? true : false;
    return res
      .status(200)
      .json({ message: "Checked saved status", isSaved: isSaved });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const createPost = async (req, res) => {
  const { title, body, location, tags } = req.body;
  console.log(title, body, location, tags);
  const images = req.files;
  console.log("CREATING THE POST");
  console.log(req.files);
  console.log("IMAGESL ");
  console.log(images);
  try {
    let result = [];
    if (images && images.length > 0) {
      // Image uploaded
      console.log("REQ FILE: ", req.file);
      console.log("IMAGE SENT");
      const uploadResults = await Promise.all(
        images.map((image) =>
          cloudinary.uploader.upload(image.path, {
            folder: "posts",
            resource_type: "image",
          }),
        ),
      );
      result = uploadResults;
    }
    let tagsArray = [];
    for (let tag of tags.split(" ")) {
      tagsArray.push(tag.toLowerCase());
    }
    console.log("HIER IN CREATING");
    console.log(result);
    const imageSecureUrls = result ? result.map((r) => r.secure_url) : null;
    const imagePublicIds = result ? result.map((r) => r.public_id) : null;

    console.log(imageSecureUrls);
    console.log(imagePublicIds);
    const post = new Post({
      userId: req.userId,
      body: body,
      title: title,
      tags: tagsArray,
      imagesUrls: imageSecureUrls,
      imagesPublicIds: imagePublicIds,
    });

    console.log("HIER IN CREATING 1");
    // if (location && location.trim().length) post.location = location;
    await post.save();
    console.log("FINISHED");
    // refresh cache for the user posts
    console.log("AUTHENTICATED USER ID : " + req.userId);
    const posts = await redis.get("user-posts-" + req.userId);
    if (posts) await redis.del("user-posts-" + req.userId);
    posts.push(post);
    redis.set("user-posts-" + req.userId, JSON.stringify(posts));
    return res.status(201).json({ message: "Post created succesfully!" });
  } catch (error) {
    res.status(400).json({ message: "Could not create post" });
  }
};

export const getPosts = async (req, res) => {
  console.log("POSTS ENDPOINT HIT");
  console.log(req.userId?.userId);
  try {
    const feed = req.params.feed;
    const posts = (await Post.find()).reverse();
    const savedPosts = await SavedPost.find({ user: req.userId });
    const userId = req.userId;
    for (let post of posts) {
      post.isSaved = false;
      for (let savedPost of savedPosts) {
        if (savedPost.post.equals(post._id)) {
          post.isSaved = true;
          break;
        }
      }
    }
    let filteredPosts = posts;
    if (feed === "Global" || feed === "") {
      filteredPosts = posts;
    } else if (feed === "Following") {
      const user = await User.findById(req.userId);
      if (!user) throw new Error("User not found");
      const following = await Follow.find({ follower: user._id });
      const followingIds = following.map((follow) =>
        follow.following.toString(),
      );
      filteredPosts = posts.filter((post) =>
        followingIds.includes(post.userId.toString()),
      );
    } else {
      // University feed
      const user = await User.findById(req.userId);
      if (!user) throw new Error("User not found");
      const university = await User.findOne({
        name: user.university,
        accountType: "business",
      });
      if (!university) throw new Error("University not found");
      filteredPosts = posts.filter(
        (post) =>
          post.caption.includes(user.university) ||
          post._id.equals(university._id) ||
          post.tags.includes(user.university.toLowerCase()),
      );
    }

    console.log("POSTS FOUND : ", filteredPosts);
    return res
      .status(200)
      .json({ posts: filteredPosts, message: "Fetched the posts succesfully" });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).json({ message: error });
  }
};

export const getPostsTags = async (req, res) => {
  try {
    const tags = await Tag.find(req.params);
    return res
      .status(200)
      .json({ tags: tags, message: "Fetched the tags succesfully" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const getPostUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id firstName lastName name profilePicture",
    );
    return res
      .status(200)
      .json({ user: user, message: "Fetched user succesfully" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getRelatedPosts = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await Post.find();
    const relatedPosts = posts.filter((post) => post.tags.includes(tag));
    return res.status(200).json({
      posts: relatedPosts,
      message: "Fetched related posts succesfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getLikes = async (req, res) => {
  const postId = req.params.id;
  try {
    console.log("POST LIKES: " + postId);
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });
    const likesNo = await Like.countDocuments({ postId: postId });
    console.log("LIKES NO: " + likesNo);
    return res.status(200).json({ message: "Likes returned", likes: likesNo });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getUsersWhoLikedPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });
    const likes = await Like.find({ postId: postId }).populate(
      "userId",
      "firstName lastName name profilePicture",
    );
    const users = likes.map((like) => like.userId);
    return res
      .status(200)
      .json({ message: "Users who liked the post", users: users });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const userHasLiked = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ message: "Post not found" });
    const likes = await Like.find({ postId: postId });
    const userLiked = likes.find((item) => item.userId.equals(req.userId));
    return res.status(200).json({
      message: "Checked liked status",
      hasLiked: userLiked ? true : false,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
export const likePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;
  console.log("POST ID HERE: " + postId);
  console.log("USER ID HERE: " + userId);
  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!user || !post) {
      throw new Error("User or post not found");
    }
    const alreadyLiked = await Like.findOne({ userId, postId });
    if (alreadyLiked) {
      throw new Error("Post already liked");
    }
    const like = await Like.create({
      userId,
      postId,
    });
    console.log("POST IN LIKE", post);
    await like.save();

    if (post.userId.equals(userId)) {
      return res.status(200).json({ message: "Liked the post successfully" });
    }

    const notification = await Notification.create({
      title: "New like",
      message: `${user.firstName} liked your post!`,
      userId: post.userId,
      actionUser: userId,
      type: "like",
    });

    io.to(getReceiverSocketId(post.userId.toString())).emit(
      "newNotification",
      notification,
    );
    await notification.save();
    console.log("NEW LIKE NOTIF", notification);
    return res.status(200).json({ message: "Liked the post successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(400).json({ message: "Liking the post went wrong" });
  }
};
export const unlikePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;
  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!user || !post) {
      throw new Error("User or post not found");
    }
    const alreadyLiked = await Like.findOne({ userId, postId });
    if (!alreadyLiked) {
      console.log("POST WAS NOT LIKED");
      return res.status(400).json({ message: "Post not liked" });
    }
    await Like.deleteOne({ userId, postId });
    return res.status(200).json({ message: "Unliked the post successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Unliking the post went wrong" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postData = req.body;
    const id = req.params.id;
    const images = req.files;
    if (!postData) throw new Error("No post data");
    const post = await Post.findById(id);
    if (!post) throw new Error("No post found with that id");
    if (!post.userId.equals(req.userId))
      throw new Error("No permission to edit");
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "posts",
      resource_type: "image",
    });
    post.caption = postData.caption;
    post.imageUrl = result.secure_url;
    post.imagePublicId = result.public_id;
    post.location = postData.location;
    post.tags = postData.tags;
    const cachedPost = await redis.get("user-posts-" + req.userId);
    if (cachedPost) await redis.del("user-posts-" + req.userId);
    await post.save();
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findByIdAndDelete(id);
    await Like.deleteMany({ postId: id });
    const posts = await redis.get("user-posts-" + req.userId);
    if (!post) throw new Error("Post not found");
    if (posts) await redis.del("user-posts-" + req.userId);
    posts.delete(post);
    redis.set("user-posts-" + req.userId, JSON.stringify(posts));
    return res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Deleting failed", error: error });
  }
};

export const getPostsByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const posts = await Post.find();
    const filteredPosts = posts.filter((post) =>
      post.caption.toLowerCase().includes(name),
    );

    return res
      .status(200)
      .json({ message: "Fetched posts by name", posts: filteredPosts });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const posts = await Post.find();
    const filteredPosts = posts.filter((post) => post.tags.includes(tag));
    return res
      .status(200)
      .json({ message: "Fetched posts by tag", posts: filteredPosts });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const deletePostsByName = async (req, res) => {
  try {
    const { title } = req.body;
    const posts = await Post.deleteMany({ title });
    return res.status(200).json({ message: "Posts deleted" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
