import express from "express";
const router = express.Router();
import {
  createPost,
  getPosts,
  getUserPosts,
  getSavedPosts,
  getPostUser,
  getLikes,
  userHasLiked,
  likePost,
  unlikePost,
  getPost,
  updatePost,
  deletePost,
  checkSaved,
  getRelatedPosts,
  getUsersWhoLikedPost,
  getPostsByName,
  getPostsByTag,
  deletePostsByName
} from "../controllers/post.controller.js";
import multer from "multer";
import { verifyToken } from "../middleware/verifyToken.js";
const upload = multer({ dest: "uploads/" });
// router.use(verifyToken);
router.get("/post/:id", getPost);
router.get("/posts/:feed", getPosts);
router.get("/post-user/:id", getPostUser);
router.get("/user-posts/:id", getUserPosts);
router.get("/saved-posts/:id", getSavedPosts);
router.get("/check-saved/:id", checkSaved);
router.get("/related-posts/:tag", getRelatedPosts);
router.get("/likes/:id", getLikes);
router.get("/users-who-liked/:id", getUsersWhoLikedPost);

router.post("/like-post", likePost);
router.post("/unlike-post", unlikePost);
router.get("/user-liked/:id", userHasLiked);
router.post("/posts", upload.array("images"), createPost);
router.patch("/posts/:id", upload.array("images"), updatePost);
router.delete("/posts/:id", deletePost);
router.get("/posts-by-name/:name", getPostsByName);
router.get("/posts-by-tag/:tag", getPostsByTag);

router.post("/delete-posts", deletePostsByName);

export default router;
