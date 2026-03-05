import { useMutation } from "@tanstack/react-query";
import { useNotificationStore } from "../../store/notificationStore";
import { useQueryClient } from "@tanstack/react-query";
export const useSeeNotifications = (userId) => {
  const { seeNotifications } = useNotificationStore();
  const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => await seeNotifications(userId),
        onSuccess: () => {  
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
            queryClient.invalidateQueries({ queryKey: ["unread-notifications", userId] });
        }   
    });
};

