import { useQuery } from "@tanstack/react-query";
import { useNotificationStore } from "../../store/notificationStore";

export const useGetUserNotifications = (userId) => {
  const { getNotifications } = useNotificationStore();
  console.log("USER IN QUERY", userId);
  return useQuery({
    queryFn: async () => await getNotifications(userId),
    queryKey: ["notifications", userId],
  });
};

export const useGetUnreadNotifications = (userId) => {
  const { getUnreadNotifications } = useNotificationStore();
  console.log("USER IN QUERY", userId); 
    return useQuery({   
        queryFn: async () => await getUnreadNotifications(userId),
        queryKey: ["unread-notifications", userId],
    });
};  


export const useGetNewMessageNotifications=(userId)=>{
   const { getNewMessagesNotifications } = useNotificationStore(); 
    return useQuery({   
        queryFn: async () => await getNewMessagesNotifications(userId),
        queryKey: ["new-messages", userId],
    });
}