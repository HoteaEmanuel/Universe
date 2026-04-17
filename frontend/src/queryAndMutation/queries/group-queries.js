import { useQuery } from "@tanstack/react-query";
import { useGroupStore } from "../../store/groupStore";
export const useGetUserGroups = (userId) => {
  const { getUserGroups } = useGroupStore();
  return useQuery({
    queryFn: async() =>await getUserGroups(userId),
    queryKey: ["user-groups", userId],
  });
};

export const useGetGroupById = (id) => {
  const { getGroupById } = useGroupStore();
  return useQuery({
    queryFn:async () =>await getGroupById(id),
    queryKey: ["group", id],
  });
};

export const useGetGroupMessages = (id) => {
  const { getGroupMessages } = useGroupStore();
  return useQuery({ 
    queryFn:async () =>await getGroupMessages(id),
    queryKey: ["group-messages", id],
  });
};

export const useGetGroupMembers = (groupId) => {
  const { getGroupMembers } = useGroupStore();
  return useQuery({ 
    queryFn: async() => await getGroupMembers(groupId),
    queryKey: ["group-members", groupId],
  });
}

export const useGetActiveGroupMembers=(groupId)=>{
  const { getActiveMembers } = useGroupStore();
  return useQuery({ 
    queryFn: async() =>await getActiveMembers(groupId),
    queryKey: ["active-group-members", groupId],
  });
}

export const useGetGroupMemberById = (id) => {
  const { getGroupMemberById } = useGroupStore();
  return useQuery({ 
    queryFn:async () => getGroupMemberById(id),
    queryKey: ["group-member", id],
  });
}

export const useGetUsersFromSameUniversityNotInGroupQuery = (groupId) => {
  const { getUsersFromSameUniversityNotInGroup } = useGroupStore();
  return useQuery({   
    queryFn: async () => await getUsersFromSameUniversityNotInGroup(groupId)(),
    queryKey: ["usersFromSameUniversityNotInGroup", groupId],
  });
}


export const useCheckUserIsAdminQuery = (groupId, userId) => {
  const { checkUserIsAdmin } = useGroupStore();
  return useQuery({
    queryFn: async () => await checkUserIsAdmin(groupId, userId),
    queryKey: ["checkUserIsAdmin", groupId, userId],
  });
} 