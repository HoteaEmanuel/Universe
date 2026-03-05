import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import {
  createGroup,
  deleteGroup,
  getUserGroups,
  getGroupById,
  getGroupMessages,
  sendMessageToGroup,
  addMemberToGroup,
  getGroupMemberById,
  getUsersFromSameUniversityNotInGroup,
  getGroupMembers,
  leaveGroup,
  kickMemberFromGroup,
  makeUserAdmin,
  updateGroupCoverImage,
  checkUserIsAdmin,
  editMessageInGroup,
  deleteMessageInGroup,
} from "../controllers/group.controller.js";
const router = express.Router();
router.post("/", createGroup);
router.delete("/:id", deleteGroup);
router.get("/user/:userId", getUserGroups);
router.get("/:id", getGroupById);
router.get("/:id/members", getGroupMembers);
router.get("/:id/auth-user", getGroupMemberById);
router.get("/:id/messages", getGroupMessages);
router.get(
  "/:id/users-from-same-university-not-in-group",
  getUsersFromSameUniversityNotInGroup,
);
router.get("/:id/check-admin/:userId", checkUserIsAdmin);
router.post("/:id/add-member", addMemberToGroup);
router.post(
  "/:id/send-message",
  upload.single("image"),
  sendMessageToGroup,
);
router.patch("/edit-message/:messageId", editMessageInGroup);
router.post("/delete-message/:messageId", deleteMessageInGroup);
router.post("/:id/make-admin/:userId", makeUserAdmin);
router.post("/:id/leave-group", leaveGroup);
router.post("/:id/kick-member/:userId", kickMemberFromGroup);
router.post(
  "/:id/change-group-image",
  upload.single("image"),
  updateGroupCoverImage,
);
export default router;
