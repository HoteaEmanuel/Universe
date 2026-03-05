import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useEditMessageMutation } from "../queryAndMutation/mutations/conversation-mutation";
import { useEditMessageInGroupMutation } from "../queryAndMutation/mutations/group-mutation";
const EditMessageModal = ({ open, onClose, message }) => {
  const editMessageMutation = useEditMessageMutation(message._id);
  const editMessageInGroupMutation = useEditMessageInGroupMutation(message._id);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    if (message.conversationId) {
      console.log("EDITING NORMAL MESSAGE");
      editMessageMutation.mutate({
        id: message._id,
        newContent: data.messageText,
      });
    } else if (message.groupId) {
      console.log("EDITING GROUP MESSAGE");
      editMessageInGroupMutation.mutate({
        id: message._id,
        newContent: data.messageText,
      });
    }
    onClose();
  };
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center ${
        open ? "visible bg-black/80" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className="w-full flex justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {errors.messageText && (
          <p className="text-red-500">{errors.messageText.message}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
          <input
            className="border p-2 rounded-sm w-full"
            defaultValue={message.content}
            {...register("messageText", {
              validate: (value) =>
                value.trim().length > 0 || "Message cannot be empty",
            })}
          ></input>
        </form>
      </div>
    </div>
  );
};

export default EditMessageModal;
