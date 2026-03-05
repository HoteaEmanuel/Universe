import { GroupMembers } from "../models/group-members.model.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { GroupMessage } from "../models/group-message.model.js";
import { isObjectIdOrHexString } from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { v2 as cloudinary } from "cloudinary";
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(name);
    const newGroup = new Group({ name, description });
    const adminMember = new GroupMembers({
      memberId: req.userId,
      groupId: newGroup._id,
      role: "admin",
    });
    await newGroup.save();
    await adminMember.save();
    return res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    return res.status(400).json({ message: "Could not create group" });
  }
};
export const addMemberToGroup = async (req, res) => {
  try {
    console.log("ADDING A NEW MEMBER TO GROUP");
    const { userId } = req.body;
    const { id: groupId } = req.params;
    console.log(userId, groupId);
    const groupMember = new GroupMembers({
      memberId: userId,
      groupId: groupId,
    });
    console.log(groupMember);
    await groupMember.save();
    console.log("SAVED");
    return res
      .status(201)
      .json({ message: "User added to the group succesfully" });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Could not delete group" });
  }
};
export const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groupMemberships = await GroupMembers.find({ memberId: userId });
    const groupIds = groupMemberships.map((membership) => membership.groupId);
    const groups = await Group.find({ _id: { $in: groupIds } })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    console.log("GROUP FOUND:");
    console.log(groups);
    return res.status(200).json({ groups });
  } catch (error) {
    return res.status(400).json({ message: "Could not retrieve user groups" });
  }
};
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json({ group });
  } catch (error) {
    return res.status(400).json({ message: "Could not retrieve group" });
  }
};
export const getGroupMessages = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    console.log("GroupId: " + groupId);
    const groupMessages = await GroupMessage.find({
      groupId: groupId,
    }).populate(
      "senderId",
      "firstName lastName profilePicture accountType name",
    );
    console.log("Group messages:");
    console.log(groupMessages);
    return res.status(200).json({ groupMessages });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not retrieve group messages" });
  }
};

export const sendMessageToGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const authUserId = req.userId;
    const { messageText } = req.body;
    const image = req.file;

    let result = undefined;
    if (image?.path) {
      result = await cloudinary.uploader.upload(image.path, {
        folder: "message_images",
        resource_type: "image",
      });
    }
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group doesnt exist");
    const message = new GroupMessage({
      senderId: authUserId,
      groupId: groupId,
      content: messageText || null,
      imageUrl: result?.secure_url || null,
      imagePublicId: result?.public_id || null,
    });
    await message.save();
    group.lastMessage = message;
    console.log("GROUP AFTER MESSAGE");
    console.log(group);
    await group.save();
    console.log("Message created");
    const users = await GroupMembers.find({ groupId: groupId });
    if (!users) {
      return res.status(404).json({ message: "No members in the group" });
    }
    users.forEach((user) => {
      io.to(getReceiverSocketId(user.memberId.toString())).emit(
        "newGroupMessage",
        message,
      );
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const editMessageInGroup = async (req, res) => {
  console.log("MESSAGE EDITED");
  try {
    const { messageId } = req.params;
    console.log("ID: " + messageId);
    const authUserId = req.userId;
    console.log("SENIOR");
    const { content: newText } = req.body;
    console.log(newText);
    const message = await GroupMessage.findOne({ _id: messageId });
    if (!message) throw new Error("Message not found");

    if (message.senderId.toString() !== authUserId.toString())
      throw new Error("Unauthorized");
    console.log("CONTINUE");
    message.content = newText;
    message.edited = true;

    message.updatedAt = Date.now();
    await message.save();
    const groupId = message.groupId.toString();
    const users = await GroupMembers.find({ groupId: groupId });
    users.forEach((user) => {
      io.to(getReceiverSocketId(user.memberId.toString())).emit(
        "messageEdited",
        message,
      );
    });
    console.log("MESSAGE EDITED IN GROUP");
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteMessageInGroup = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const authUserId = req.userId;
    const message = await GroupMessage.findOne({ _id: messageId });
    if (!message) throw new Error("Message not found");
    if (message.senderId.toString() !== authUserId.toString())
      throw new Error("Unauthorized");
    message.deleted = true;
    await message.save();
    const groupId = message.groupId.toString();
    const users = await GroupMembers.find({ groupId: groupId });
    users.forEach((user) => {
      io.to(getReceiverSocketId(user.memberId.toString())).emit(
        "messageDeleted",
        messageId,
      );
    });
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const groupMembers = await GroupMembers.find({ groupId: groupId }).populate(
      "memberId",
      "firstName lastName profilePicture accountType _id university",
    );
    return res.status(200).json({ members: groupMembers });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not retrieve group members" });
  }
};
export const getGroupMemberById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const member = await GroupMembers.findOne({
      groupId: groupId,
      memberId: req.userId,
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found in group" });
    }
    return res.status(200).json({ member });
  } catch (error) {
    return res.status(400).json({ message: "Could not retrieve group member" });
  }
};

export const getUsersFromSameUniversityNotInGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const groupMembers = await GroupMembers.find({ groupId: groupId });
    const memberIds = groupMembers.map((member) => member.memberId);
    const authUser = await User.findById(req.userId);
    if (!authUser) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }
    const usersFromSameUniversity = await User.find({
      university: authUser.university,
      _id: { $ne: req.userId, $nin: memberIds },
    }).select(
      "firstName lastName name profilePicture accountType _id university",
    );
    return res.status(200).json({
      message: "Fetched users from same university not in group",
      users: usersFromSameUniversity,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    await GroupMembers.findOneAndDelete({
      groupId: groupId,
      memberId: req.userId,
    });
    return res.status(200).json({ message: "Left the group successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Could not leave the group" });
  }
};

export const kickMemberFromGroup = async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    await GroupMembers.findOneAndDelete({
      groupId: groupId,
      memberId: userId,
    });
    return res
      .status(200)
      .json({ message: "Member kicked from the group successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not kick member from group" });
  }
};
export const checkUserIsAdmin = async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    const member = await GroupMembers.findOne({
      groupId: groupId,
      memberId: userId,
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found in group" });
    }
    const isAdmin = member.role === "admin";
    return res.status(200).json({ isAdmin });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not verify if member is admin" });
  }
};
export const makeUserAdmin = async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    const member = await GroupMembers.findOne({
      groupId: groupId,
      memberId: userId,
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found in group" });
    }
    member.role = "admin";
    await member.save();
    return res
      .status(200)
      .json({ message: "Member promoted to admin successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Could not promote member to admin" });
  } finally {
    set({ isLoading: false });
  }
};

export const updateGroupCoverImage = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const image = req.file;
    let result = undefined;
    if (image?.path) {
      result = await cloudinary.uploader.upload(image.path, {
        folder: "group_covers",
        resource_type: "image",
      });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    group.coverImageUrl = result?.secure_url || group.coverImageUrl;
    group.coverImagePublicId = result?.public_id || group.coverImagePublicId;
    await group.save();
    return res
      .status(200)
      .json({ message: "Updated the group cover image successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Updating the group cover image went wrong",
      error: error,
    });
  }
};
