import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const findConversationByParticipants = async (
  authUserId,
  otherUserId,
) => {
  const conversation = await Conversation.findOne({
    participants: [authUserId, otherUserId] || [otherUserId, authUserId],
  });

  return conversation;
};

export const createConversation = async (data) => {
  const { authUserId, otherUserId, messageData } = data;
  const conversation = await Conversation.create({
    participants: [authUserId, otherUserId],
    lastMessage: messageData,
    updatedAt: Date.now(),
  });

  return conversation;
};

export const findConversationById = async (id) => {
  const conversation = await Conversation.findOne({
    _id: id,
  });

  return conversation;
};

export const findAllConversationsByParticipant = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate(
      "participants",
      "-password -verificationToken -verificationTokenExpiresAt -createdAt -updatedAt -isVerified -identityVerified -role -email -lastLogin -bio -major -university",
    )
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
  return conversations;
};
