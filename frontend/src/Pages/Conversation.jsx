import React, { useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import ConversationLayout from "../components/ConversationLayout";
import {
  useGetConvoMessages,
  useGetUserByConvoId,
} from "../queryAndMutation/queries/conversation-queries";
import { useAuthStore } from "../store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { urlPathName } from "../utils/urlPathFromName";
import { SlOptionsVertical } from "react-icons/sl";
import { useSeeNewMessages } from "../queryAndMutation/mutations/notification-mutation";
const Conversation = () => {
  const { id: convoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, socket } = useAuthStore();
  const { data: user, isPending: isPendingUser } = useGetUserByConvoId(convoId);
  const { mutate: seeNewMessages } = useSeeNewMessages(authUser._id, convoId);
  const { data: messages, isPending: isPendingMessages } =
    useGetConvoMessages(convoId);
  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      queryClient.invalidateQueries(["conversation_messages", convoId]);
    });
  }, [socket, queryClient, convoId]);

  useEffect(() => {
    socket.emit("view_conversation", convoId, authUser._id);

    seeNewMessages();

    return ()=>{
      socket.emit("leave_conversation",convoId,authUser._id);
    }
  }, [seeNewMessages, socket, authUser, convoId]);

  const fullName = urlPathName(user);
  if (isPendingUser || isPendingMessages) return <p>Loading...</p>;
  console.log(messages);
  return (
    <section className="w-full overflow-y-hidden">
      <div className="flex justify-center items-center gap-1 w-full p-2 md:p-5">
        <div className="flex flex-col">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="user"
              className="size-15 md:size-20 rounded-full mr-2 cursor-pointer"
              onClick={() => navigate(`/users/${fullName}`)}
            />
          ) : (
            <FaUserCircle
              className="size-20 cursor-pointer"
              onClick={() => navigate(`/users/${fullName}`)}
            />
          )}
        </div>

        <div className="w-full">
          <p className="text-xss md:text-sm font-sans px-2">
            {user?.university || "No university specified"}
          </p>
          <h1 className="text-lg lg:text-2xl font-semibold p-2">
            {user?.firstName || user?.name}{" "}
            {user.accountType === "normal" ? user?.lastName : ""}
          </h1>
        </div>
        <SlOptionsVertical className="size-5 icon" />
      </div>
      <ConversationLayout id={convoId} messages={messages}></ConversationLayout>
    </section>
  );
};

export default Conversation;
