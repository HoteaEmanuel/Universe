import express from "express";
import {
  getMessages,
  getConversationByUserIds,
  sendMessage,
  getConversations,
  getConvoById,
  getConvoUser,
  startConversation,
  getConvoUsers,
  deleteMessage,
  editMessage,
} from "../controllers/conversation.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
// router.use(verifyToken);
router.get("/", getConversations);
router.get("/users", getConvoUsers);
router.get("/:id", getConvoById);
router.get("/messages/:id", getMessages);
router.get("/:id/messages", getMessages);
router.get("/:id/user", getConvoUser);
router.get("/user/:id", getConversationByUserIds);
router.post("/start-conversation/:id", startConversation);
router.post(
  "/:id/send-message",
  upload.any(),
  sendMessage,
);
router.delete("/delete-messages/:id", deleteMessage);
router.patch("/edit-messages/:id", editMessage  );
export default router;
