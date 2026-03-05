import express from "express";
import {
  deleteComment,
  getComments,
  getCommentsCount,
  likeComment,
  removeLikeComment,
  sendComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
// router.use(verifyToken);
router.get("/posts/:id/comments", getComments);
router.get("/posts/:id/comments-count", getCommentsCount);
router.post("/posts/:id/send-comment", sendComment);
router.post("/posts/:id/like-comment", likeComment);
router.post("/posts/:id/remove-like-comment", removeLikeComment);
router.delete("/posts/:id/delete-comment", deleteComment);
export default router;
