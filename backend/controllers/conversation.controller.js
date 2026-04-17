
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

import {
  deleteMessage,
  editMessage,
  getUserConversations,
  sendMessage,
  startConversation,
} from "../services/conversation.service.js";
export const getConvoById = async (req, res) => {
  try {
    const convoId = req.params.id;
    const convo = await Conversation.findOne({ _id: convoId });
    if (!convo) throw new Error("Conversation not found");
    return res.status(200).json({
      message: "Conversation found successfully",
      conversation: convo,
    });
  } catch (error) {
    return res.status(200).json({
      error: error,
    });
  }
};

export const getConvoUser = async (req, res) => {
  try {
    const convoId = req.params.id;
    const authUser = req.userId;
    const convo = await Conversation.findOne({ _id: convoId });
    if (!convo) throw new Error("Conversation not found");
    let otherUser = convo.participants[0].equals(authUser)
      ? convo.participants[1]._id
      : convo.participants[0]._id;
    const user = await User.findOne(
      { _id: otherUser },
      "-password -verificationToken -verificationTokenExpiresAt -createdAt -updatedAt -isVerified -email",
    );
    return res.status(200).json({ message: "User found", user });
  } catch (error) {}
};
export const getConversationsController = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await getUserConversations(userId);
    return res.status(200).json({
      message: "Fetched the conversations",
      conversations,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const getConvoUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      participants: userId,
    }).populate(
      "participants",
      "-password -verificationToken -verificationTokenExpiresAt -createdAt -updatedAt -isVerified -email",
    );
    const convoUsers = conversations.map((convo) =>
      convo.participants.find((p) => !p._id.equals(userId)),
    );
    return res
      .status(200)
      .json({ message: "Fetched the conversation users", users: convoUsers });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const getConversationByUserIds = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.userId;
    if (receiverId === senderId) throw new Error("Same users");
    console.log(receiverId, senderId);
    const conversationStartedByAuthUser = await Conversation.findOne({
      participants: [senderId, receiverId],
    });
    const conversationStartedByOther = await Conversation.findOne({
      participants: [receiverId, senderId],
    });
    return res.status(200).json({
      message: "Conversation found",
      conversation: conversationStartedByAuthUser || conversationStartedByOther,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const convoId = req.params.id;
    if (!convoId) throw new Error("No convo id provided");
    const messages = await Message.find({ conversationId: convoId });
    return res
      .status(200)
      .json({ message: "Fetched the messages successfully", messages });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const startConversationController = async (req, res) => {
  console.log("INCEPE O CONVERSATIE");
  try {
    const { id: userId } = req.params;
    const authUserId = req.userId;
    const { message: messageData } = req.body;
    const data = { authUserId, otherUserId: userId, messageData };
    console.log("AICEA")
    const newConversationId=await startConversation(data);
    return res.status(201).json({ message: "Conversation started",id: newConversationId});
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const sendMessageController = async (req, res) => {
  try {
    const { id: convoId } = req.params;
    const authUserId = req.userId;
    const { messageText } = req.body;
    const images = req.files;
    const data = { convoId, authUserId, messageText, images };
    const message = await sendMessage(data);

    return res.status(201).json(message);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const deleteMessageController = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const authUserId = req.userId;
    const data = { messageId, authUserId };
    await deleteMessage(data);
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const editMessageController = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const authUserId = req.userId;
    const { newContent } = req.body;
    const data = { newContent, senderId: authUserId, messageId };
    await editMessage(data);
    return res.status(200).json({ message: "Message edited successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
