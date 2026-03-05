import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDeleteMessageMutation } from "../queryAndMutation/mutations/conversation-mutation";
import { useState } from "react";
import EditMessageModal from "./EditMessageModal";
import { useDeleteMessageInGroupMutation } from "../queryAndMutation/mutations/group-mutation";
const MessageOptionsModal = ({ open, onClose, message }) => {
  console.log("Message ID in modal: " + message?._id);
  const deleteMessageMutation = useDeleteMessageMutation(message?._id);
  const deleteMessageInGroupMutation = useDeleteMessageInGroupMutation(
    message?._id,
  );
  const [showEditMessage, setShowEditMessage] = useState(false);
  console.log("MESSAGE MODAL: ");
  console.log(message);
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center ${
        open ? "visible" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className="absolute top-50 right-10 border p-2 rounded-2xl container w-40 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <ul className="flex flex-col gap-4">
          {message?.content && (
            <li
              className="p-2 hoverGray rounded-md cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditMessage(true);
              }}
            >
              Edit message{" "}
            </li>
          )}
          <li
            className="p-2 hoverGray rounded-md cursor-pointer"
            onClick={async (e) => {
              e.stopPropagation();
              console.log("BUNA: ", message);
              if (message?.conversationId) {
                await deleteMessageMutation.mutate(message?._id);
              } else {
                await deleteMessageInGroupMutation.mutate(message?._id);
              }
              onClose();
            }}
          >
            Delete message{" "}
          </li>
        </ul>
        {showEditMessage && (
          <EditMessageModal
            open={showEditMessage}
            onClose={() => setShowEditMessage(false)}
            message={message}
          />
        )}
      </div>
    </div>
  );
};

export default MessageOptionsModal;
