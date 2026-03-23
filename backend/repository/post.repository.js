import { Post } from "../models/post.model.js";
import { SavedPost } from "../models/savedPosts.model.js";
export const findPostById = async (id) => {
  const post = await Post.findById(id);
  return post;
};
export const findAllPosts = async () => {
  const allPosts = (await Post.find()).reverse();
  return allPosts;
};
export const findUserPosts = async (userId) => {
  const posts = await Post.find({ userId: userId }).sort({
    createdAt: -1,
  });
  return posts;
};

export const findUserSavedPosts = async (userId) => {
  const savedPosts = await SavedPost.find({ user: userId })
    .sort({ savedAt: -1 })
    .populate("post")
    .lean();

  return savedPosts;
};

export const createPost = async (data) => {
  const { userId, body, title, tags, location, imageUrls, imagePublicIds } =
    data;

  console.log(userId, body, title, tags, imageUrls, imagePublicIds);
  console.log("AQUI");
  const post = await Post.create({
    userId: userId,
    body: body,
    title: title,
    tags: tags,
    imagesUrls: imageUrls,
    imagesPublicIds: imagePublicIds,
  });
  console.log("CREATED?");
  return post;
};

export const findPostsByText = async (text) => {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const filteredPosts = await Post.find({
    $or: [
      { title: { $regex: escaped, $options: "i" } },
      { body: { $regex: escaped, $options: "i" } },
    ],
  });

  return filteredPosts;
};

export const findPostsByTag = async (tag) => {
  const posts = await Post.find({ tags: tag });
  return posts;
};

export const findSavedPostByIds = async (userId, postId) => {
  const savedPost = await SavedPost.findOne({
    user: userId,
    post: postId,
  });

  return savedPost;
};

export const createSavedPost = async (userId, postId) => {
  const post = SavedPost.create({
    user: userId,
    post: postId,
  });
  return post;
};
