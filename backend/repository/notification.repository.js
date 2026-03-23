import { Notification } from "../models/notification.model.js";
export const createNotification = async (data) => {
  const { userId, actionUserId, type, title, message } = data;
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
