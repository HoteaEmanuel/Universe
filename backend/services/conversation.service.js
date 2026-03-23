import {
  createConversation,
  findAllConversationsByParticipant,
  findConversationById,
  findConversationByParticipants,
} from "../repository/conversation.repository.js";
import {
  createMessage,
  findMessageById,
} from "../repository/message.repository.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { v2 as cloudinary } from "cloudinary";
export const startConversation = async (data) => {
  const { authUserId, otherUserId, messageData } = data;
  if (!messageData) throw new Error("No message");
  const message = await createMessage(data);

  const conversation = await findConversationByParticipants(
    authUserId,
    otherUserId,
  );
  if (conversation) throw new Error("Conversation already exists");

  const newConversation = await createConversation(data);

  message.conversationId = newConversation._id;
  await newConversation.save();
  await message.save();
  io.to(getReceiverSocketId(otherUserId.toString())).emit(
    "newMesssage",
    message,
  );
  const newConversationId = newConversation._id;

  return newConversationId;
};

export const sendMessage = async (data) => {
  const { convoId, messageText, images, authUserId } = data;
  let conversation = await findConversationById(convoId);
  if (!conversation) throw new Error("Conversation doesnt exist");

  let result = undefined;
  if (images && images.length > 0) {
    result = await Promise.all(
      images.map((image) =>
        cloudinary.uploader.upload(image.path, {
          folder: "message_images",
          resource_type: "image",
        }),
      ),
    );
  }

  const imageSecureUrls = result ? result.map((r) => r.secure_url) : null;
  const imagePublicIds = result ? result.map((r) => r.public_id) : null;

  const userId = conversation.participants[0].equals(authUserId)
    ? conversation.participants[1]
    : conversation.participants[0];

  const messageData = {
    senderId: authUserId,
    receiverId: userId.toString(),
    conversationId:convoId,
    content: messageText,
    imageUrls: imageSecureUrls,
    imagePublicIds: imagePublicIds,
  };

  const message = await createMessage(messageData);

  message.content = messageText;
  if (result && result.length > 0)
    message.images = result.map((img) => ({ publicId: img.public_id }));
  conversation.lastMessage = message;
  await conversation.save();
  await message.save();

  io.to(getReceiverSocketId(userId.toString())).emit("newMessage", message);
  return message;
};

export const deleteMessage = async (data) => {
  const { messageId, authUserId } = data;
  const message = await findMessageById(messageId);
  if (!message) throw new Error("Message not found");
  if (message.senderId.toString() !== authUserId.toString())
    throw new Error("Unauthorized");
  message.deleted = true;
  await message.save();
  io.to(getReceiverSocketId(message.receiverId.toString())).emit(
    "messageDeleted",
    id,
  );
};

export const editMessage = async (data) => {
  const { newContent, messageId, senderId } = data;

  const message = await findMessageById(messageId);

  if (message.senderId.toString() !== senderId)
    throw new Error("No authorization to edit the message");
  if (!message) throw new Error("Message not found");
  message.content = newContent;
  message.edited = true;
  message.updatedAt = Date.now();
  await message.save();
  io.to(getReceiverSocketId(message.receiverId.toString())).emit(
    "messageEdited",
    message,
  );
};

export const getUserConversations = async (userId) => {
  const conversations = await findAllConversationsByParticipant(userId);

  const convoUsers = conversations.map((convo) =>
    convo.participants.find((p) => !p._id.equals(userId)),
  );
  console.log("DEBUG CONVOS");
  console.log(conversations);
  for (let i = 0; i < conversations.length; i++) {
    conversations[i] = {
      _id: conversations[i]._id,
      lastMessage: conversations[i].lastMessage,
      user: convoUsers[i],
    };
  }

  return conversations;
};
