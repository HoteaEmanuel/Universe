import { Post } from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import { SavedPost } from "../models/savedPosts.model.js";
import { Like } from "../models/like.model.js";
import { Tag } from "../models/tag.model.js";
import {
  createNewPost,
  deletePost,
  getPosts,
  getPostsByTag,
  getSavedPosts,
  getSearchedPosts,
  getUserPosts,
  likePost,
  unlikePost,
  updatePost,
} from "../services/post.service.js";
// import { createDiffieHellmanGroup } from "crypto";
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found");
    const savedPost = await SavedPost.findOne({ user: req.userId, post: id });
    if (savedPost) post.isSaved = true;
    else post.isSaved = false;
    return res.status(200).json({ message: "Succes", post: post });
  } catch (error) {
    return res.status(400).json({ message: "Error, no post found" });
  }
};

export const getUserPostsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const userPosts = await getUserPosts(userId);
    return res.status(200).json({ message: "Fetched posts", posts: userPosts });
  } catch (error) {
    return res.status(400).json({ message: "Failed", error: error });
  }
};

export const getSavedPostsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const savedPosts = await getSavedPosts(userId);
    return res
      .status(200)
      .json({ message: "Fetched the saved posts", savedPosts });
  } catch (error) {
    return res.status(400).json({ error: error.message });
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

export const createPostController = async (req, res) => {
  const images = req.files;
  const postData = {
    body: req.body,
    userId: req.userId,
    images,
  };
  try {
    await createNewPost(postData);
    return res.status(201).json({ message: "Post created succesfully!" });
  } catch (error) {
    res.status(400).json({ message: "Could not create post" });
  }
};

export const getPostsController = async (req, res) => {
  try {
    const feed = req.params.feed;
    const userId = req.userId;
    const data = { feed, userId };
    const posts = await getPosts(data);
    return res
      .status(200)
      .json({ posts: posts, message: "Fetched the posts succesfully" });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).json({ message: error.message });
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
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });
    const likesNo = await Like.countDocuments({ postId: postId });
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
export const likePostController = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;
  try {
    const data = { postId, userId };
    await likePost(data);
    return res.status(200).json({ message: "Liked the post successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Liking the post went wrong" });
  }
};
export const unlikePostController = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;
  try {
    const data = { postId, userId };
    await unlikePost(data);
    return res.status(200).json({ message: "Unliked the post successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Unliking the post went wrong" });
  }
};

export const updatePostController = async (req, res) => {
  console.log("UPDATE POOOST");
  try {
    const postData = req.body;
    const id = req.params.id;
    const images = req.files;
    const data = { postData, postId: id, userId: req.userId, images };

    await updatePost(data);
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { postId: id, userId: req.userId };
    await deletePost(data);
    return res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Deleting failed", error: error });
  }
};

export const getSearchedPostsController = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const posts = await getSearchedPosts(name);
    return res
      .status(200)
      .json({ message: "Fetched posts by name", posts: posts });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPostsByTagController = async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const posts = await getPostsByTag(tag);
    return res
      .status(200)
      .json({ message: "Fetched posts by tag", posts: posts });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
