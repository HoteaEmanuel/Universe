import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useConversationStore } from "../store/conversationStore";
import { useGetConversationByUsersIdsQuery } from "../queryAndMutation/queries/conversation-queries";
import { useQueryClient } from "@tanstack/react-query";
const StartConversationMessageInput = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  // const { sendMessage } = useConversationStore();
  const { id } = useParams();
  const { startConversation } = useConversationStore();
  const { data: conversation, isPending: isPendingGettingConvo } =
    useGetConversationByUsersIdsQuery(id);
  const queryClient = useQueryClient();
  const [newConversationId, setNewConversationId] = useState(undefined);
  useEffect(() => {
    if (newConversationId) {
      queryClient.invalidateQueries[
        ("conversation_messages", newConversationId)
      ];
      console.log(newConversationId);
      return navigate(`/conversation/${newConversationId}`);
    }
  }, [newConversationId, navigate, queryClient]);
  const onSubmit = async (data) => {
    console.log(data);
    setNewConversationId(await startConversation(id, data.message));
  };
  if (isPendingGettingConvo) return <p>Loading...</p>;
  if (conversation) return navigate(`/conversation/${conversation._id}`);
  return (
    <section className="sticky bottom-2 top-0 right-0 left-0">
      <form className="w-full flex gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full border rounded-lg p-1 commentsContainer"
          {...register("message", {
            required: "Enter a non empty message",
            validate: (message) => {
              if (message.trim() === "") return "Enter a valid message";
            },
          })}
          placeholder="Send a message"
          required
        />
        <button>
          <IoIosSend className="size-6 hover:scale-110" />
        </button>
      </form>
    </section>
  );
};

export default StartConversationMessageInput;
