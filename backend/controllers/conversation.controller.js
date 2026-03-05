import { populate } from "dotenv";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { v2 as cloudinary } from "cloudinary";
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
export const getConversations = async (req, res) => {
  console.log("GETTING THE CONVERSATIONS");
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate(
        "participants",
        "-password -verificationToken -verificationTokenExpiresAt -createdAt -updatedAt -isVerified -identityVerified -role -email -lastLogin -bio -major -university",
      )
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    const convoUsers = conversations.map((convo) =>
      convo.participants.find((p) => !p._id.equals(userId)),
    );
    console.log("DEBUG CONVOS");
    for (let i = 0; i < conversations.length; i++) {
      conversations[i] = {
        _id: conversations[i]._id,
        lastMessage: conversations[i].lastMessage,
        user: convoUsers[i],
      };
    }

    console.log("CONVS:  ");
    console.log(conversations);
    console.log("USERS: ");
    console.log(convoUsers);
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
export const startConversation = async (req, res) => {
  console.log("INCEPE O CONVERSATIE");
  try {
    const { id: userId } = req.params;
    const authUserId = req.userId;
    const { message: messageData } = req.body;
    console.log(userId, messageData);
    if (!messageData) throw new Error("No message");
    const message = new Message({
      senderId: authUserId,
      receiverId: userId,
      content: messageData,
    });
    const conversation = await Conversation.findOne({
      participants: [authUserId, userId] || [userId, authUserId],
    });
    if (conversation) throw new Error("Conversation already exists");

    const newConversation = new Conversation({
      participants: [authUserId, userId],
      lastMessage: message,
      updatedAt: Date.now(),
    });
    message.conversationId = newConversation._id;
    await newConversation.save();
    await message.save();
    console.log("Message created");
    io.to(userId).emit("newMesssage", message);
    const newConversationId = newConversation._id;
    return res.status(201).json(newConversationId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
export const sendMessage = async (req, res) => {
  console.log("SENDING A MESSAGE");
  try {
    const { id: convoId } = req.params;
    const authUserId = req.userId;
    const { messageText } = req.body;
    const images = req.files;
    console.log(messageText, images);
    let conversation = await Conversation.findOne({
      _id: convoId,
    });
    if (!conversation) throw new Error("Conversation doesnt exist");
    let result = undefined;
    console.log("PANA LA UPLOAD");
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
    console.log(result);
    console.log("AICIIIII");
    const userId = conversation.participants[0].equals(authUserId)
      ? conversation.participants[1]._id
      : conversation.participants[0]._id;

    const message = new Message({
      senderId: authUserId,
      receiverId: userId,
    });
    console.log("AICI?");

    console.log("RESULT ", result);
    message.content = messageText || null;
    if (result && result.length > 0)
      message.images = result.map((img) => ({ publicId: img.public_id }));
    message.conversationId = convoId;
    conversation.lastMessage = message;
    console.log(message, conversation);
    await conversation.save();
    await message.save();

    console.log("Message created");
    console.log(message);
    io.to(getReceiverSocketId(userId.toString())).emit("newMessage", message);
    return res.status(201).json(message);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const deleteMessage = async (req, res) => {
  console.log("DEL MESS");
  try {
    const { id: messageId } = req.params;
    const authUserId = req.userId;
    const message = await Message.findOne({ _id: messageId });
    if (!message) throw new Error("Message not found");
    if (message.senderId.toString() !== authUserId.toString())
      throw new Error("Unauthorized");
    message.deleted = true;
    await message.save();
    io.to(getReceiverSocketId(message.receiverId.toString())).emit(
      "messageDeleted",
      messageId,
    );
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const editMessage = async (req, res) => {
  console.log("EDITING THE MESSAGE");
  try {
    const { id: messageId } = req.params;
    const authUserId = req.userId;
    console.log("HEREE");
    const { content: newContent } = req.body;
    console.log("CONTENT:");
    console.log(newContent);
    const message = await Message.findOne({ _id: messageId });
    if (!message) throw new Error("Message not found");
    message.content = newContent;
    message.edited = true;
    message.updatedAt = Date.now();
    await message.save();
    io.to(getReceiverSocketId(message.receiverId.toString())).emit(
      "messageEdited",
      message,
    );
    console.log("EDITING FINISHED");
    return res.status(200).json({ message: "Message edited successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
