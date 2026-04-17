import { Notification } from "../models/notification.model.js";
export const createNotification = async (data) => {
  const { userId, actionUserId, type, title, message } = data;
  console.log("NOTIF CREATED");

  console.log(userId,actionUserId,type,title,message);
  const notification = await Notification.create({
    title: title,
    message: message,
    userId: userId,
    actionUser: actionUserId,
    type: type,
  });
  return notification;
};

export const createMessageNotification=async (data) => {
  const { userId, actionUserId, type, title, message,conversationId } = data;

  console.log(userId,actionUserId,type,title,message);
  const notification = await Notification.create({
    title: title,
    message: message,
    userId: userId,
    actionUser: actionUserId,
    type: type,
    conversationId:conversationId
  });
  return notification;
};
