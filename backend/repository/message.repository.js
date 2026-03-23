import { GroupMessage } from "../models/group-message.model.js";
import { Message } from "../models/message.model.js";

export const createMessage = async (data) => {
  const {
    conversationId,
    senderId,
    receiverId,
    content,
    imageUrls,
    imagePublicIds,
  } = data;
  const message = await Message.create({
    conversationId,
    senderId,
    receiverId,
    content: content || null,
    imageUrls,
    imagePublicIds,
  });
  return message;
};

export const findMessageById = async (id) => {
  const message = await Message.findOne({ _id: id });
  return message;
};

export const createGroupMessage = async (data) => {
  const { senderId, groupId, messageText, imageUrls, imagePublicIds } = data;
  const groupMessage = await GroupMessage.create({
    senderId,
    groupId: groupId,
    content: messageText || null,
    imageUrls: imageUrls,
    imagePublicIds: imagePublicIds,
  });

  return groupMessage;
};

export const findGroupMessageById = async (id) => {
  const groupMessage = await GroupMessage.findOne({ _id: id });
  return groupMessage;
};
