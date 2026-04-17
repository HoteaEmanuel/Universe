import axios from "axios";
import { create } from "zustand";
const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api";
export const useNotificationStore = create(() => ({
  getNotifications: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/${id}`);
      return response.data.notifications;
    } catch (error) {
      throw new Error(error);
    }
  },
  getUnreadNotifications:async(id)=>{
    try {
      const response = await axios.get(`${API_URL}/unread-notifications/${id}`);
      return response.data.notifications;
    } catch (error) {
      throw new Error(error);
    }
  },

  getNewMessagesNotifications:async(id)=>{
     try {
      const response = await axios.get(`${API_URL}/unread-message-notifications/${id}`);
      return response.data.notifications;
    } catch (error) {
      throw new Error(error);
    }
  },
  seeNotifications: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/seen-notifications/${id}`);
      return response.data.message;
    } catch (error) {
      throw new Error(error);
    }
    },
    seeNewMessages:async(convoId)=>{
      try{
        console.log("SEE NEW MESSSAGES");
        const response=await axios.post(`${API_URL}/see-new-messages/${convoId}`);
        return response.data.message;
      }
      catch(error){
        throw new Error(error);
      }
    }
}));
