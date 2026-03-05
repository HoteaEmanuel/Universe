import React from "react";
import ProfileCard from "../components/ProfileCard";
import { useParams } from "react-router-dom";
import {
  useGetGroupById,
  useGetGroupMessages,
} from "../queryAndMutation/queries/group-queries";
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { CiMenuKebab } from "react-icons/ci";
import { SlOptionsVertical } from "react-icons/sl";
import GroupConversationLayout from "../components/GroupConversationLayout";
import { useState } from "react";
import GroupMenuModal from "../Modals/GroupMenuModal";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import ProfileImageModal from "../Modals/ProfileImageModal";
import GroupImageModal from "../Modals/GroupImageModal";
const Group = () => {
  const [menu, setMenu] = useState(false);
  const [groupImageModal, setGroupImageModal] = useState(false);
  const { socket } = useAuthStore();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: group, isPending: isPendingGroup } = useGetGroupById(id);
  const { data: messages, isPending: isPendingMessages } =
    useGetGroupMessages(id);
  useEffect(() => {
    const handleNewGroupMessage = (message) => {
      console.log("New message received:", message);
      if (message.groupId === id) {
        queryClient.invalidateQueries(["group_messages", id]);
      }
    };

    socket.on("newGroupMessage", handleNewGroupMessage);

    // CLEANUP - șterge listener-ul când componenta se demontează sau id se schimbă
    return () => {
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, [socket, queryClient, id]);

  if (isPendingGroup) return <p>Loading...</p>;
  if (isPendingMessages) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen">
      <div className="p-5 flex border-b w-full border-gray-500 items-center gap-4">
        <button onClick={() => setGroupImageModal(true)}>
          {group.coverImageUrl ? (
            <img
              src={group.coverImageUrl}
              alt="cover"
              className="size-10 rounded-full object-cover mr-2 cursor-pointer"
            />
          ) : (
            <FaUserGroup className="size-12 object-cover mr-2 cursor-pointer" />
          )}
        </button>

        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold">{group.name}</h1>
          {group.description && (
            <>
              <p className="opacity-70 text-sm">Description:</p>
              <p className="text-[10px]">{group.description}</p>
            </>
          )}
        </div>
        <SlOptionsVertical
          className="ml-auto size-8 icon"
          onClick={() => setMenu(true)}
        />
      </div>

      <div>
        <GroupConversationLayout group={group} messages={messages} />
        <GroupMenuModal open={menu} onClose={() => setMenu(false)} />
        <ProfileImageModal
          open={groupImageModal}
          onClose={() => setGroupImageModal(false)}
          entityType="group"
        />
      </div>
    </div>
  );
};

export default Group;
