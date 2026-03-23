import { Group } from "../models/group.model.js";

export const createGroup = async (data) => {
  const { name, description } = data;
  const newGroup = await Group.create({ name, description });
  return newGroup;
};

export const findGroupById = async (groupId) => {
  const group = await Group.find({ _id: groupId });
  return group;
};
