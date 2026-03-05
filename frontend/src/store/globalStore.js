import { create } from "zustand";

export const useGlobalStore= create((set) => ({
  user: null,
  notificationsOn : true,
  setUser: (user) => set({ user }),
  toggleNotifications: () => set((state) => ({ notificationsOn: !state.notificationsOn })),
}));