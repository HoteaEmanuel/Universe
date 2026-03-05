import express from "express";
import {
  deleteNotifications,
  getUnreadNotifications,
  getUserNotifications,
  seeNotifications
} from "../controllers/notifications.controller.js";
const router = express.Router();
router.get("/notifications/:id", getUserNotifications);

router.get("/unread-notifications/:id", getUnreadNotifications);
router.post("/seen-notifications/:id", seeNotifications);
router.post("/delete-notifications/:id", deleteNotifications);

export default router;
