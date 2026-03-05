import axios from "axios";
import { create } from "zustand";
const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true;
export const useCommentsStore = create((set) => ({
  isLoading: false,
  getComments: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/posts/${id}/comments`);
      return response.data.comments;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  likeComment:async(id)=>{
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/posts/${id}/like-comment`);
  
      return response.data;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    } 
  },
  removeLikeComment:async(id)=>{
    set({ isLoading: true }); 
    try {
      const response = await axios.post(`${API_URL}/posts/${id}/remove-like-comment`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    } 
  },
  getCommentsCount: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/posts/${id}/comments-count`);
      return response.data.commentsCount;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  sendComment: async (id, comment) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/posts/${id}/send-comment`, {
        comment: comment,
      });
      return response;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteComment: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(
        `${API_URL}/posts/${id}/delete-comment`
      );
      return response;
    } catch (error) {
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
