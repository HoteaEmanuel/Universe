import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("USER ID HE: ", id);
    const user = await User.findById(id);
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found with specified id" });

    const notifications = await Notification.find({
      userId: id,
    })
      .sort({
        createdAt: -1,
      })
      .populate("actionUser", "profilePicture firstName lastName name _id");

    return res.status(200).json({ notifications: notifications });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const getUnreadMessageNotifications=async(req,res)=>{
  try {
    console.log("GET UNREAD MESSAGE NOTIF:");
    const id = req.params.id;
    console.log(id);
    const notifications = await Notification.find({
      userId: id,
      read: false,
      type: "message"
    }).sort({ createdAt: -1 });
    return res.status(200).json({ notifications: notifications });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export const getUnreadNotifications = async (req, res) => {
  try {
    console.log("GET UNREAD NOTIF:");
    const id = req.params.id;
    console.log(id);
    const notifications = await Notification.find({
      userId: id,
      read: false,
      type: {$ne :"message"}
    }).sort({ createdAt: -1 });

    console.log("UNREAD NOTIFS: ", notifications);
    return res.status(200).json({ notifications: notifications });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("USER ID: ", id);
    await Notification.deleteMany({ userId: id });

    const notificiations = await Notification.find({ userId: id });
    console.log("NOTIFICATIONS AFTER DELETE: ", notificiations);
    return res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const seeNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    await Notification.updateMany({ userId: id }, { $set: { read: true } });
    return res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const seeNewConversationMessages=async(req,res)=>{
  try{
    const id=req.params.id;
    await Notification.updateMany({userId:req.userId,conversationId:id}, {$set: { read:true}});
    return res.status(200).json({message:"All new messages were read"});
  }
  catch(error){
    return res.status(400).json({error:error.message})
  }
}
