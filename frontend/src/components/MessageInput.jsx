import React from "react";
import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useSendMessageMutation } from "../queryAndMutation/mutations/conversation-mutation";
import { BiSolidImageAdd } from "react-icons/bi";
import ImagePickerModal from "../Modals/ImagePickerModal";
import { useSendMessageToGroupMutation } from "../queryAndMutation/mutations/group-mutation";

const MessageInput = ({ images, setImages, messageType }) => {
  // const { sendMessage } = useConversationStore();
  const { id } = useParams();
  // const { sendMessage } = useConversationStore();
  const sendMessage = useSendMessageMutation(id);
  const [message, setMessage] = useState("");
  const { mutateAsync: sendMessageToGroup } = useSendMessageToGroupMutation();
  // const { sendMessage } = useConversationStore();
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageForm = new FormData(e.target);
    const message = Object.fromEntries(messageForm);
    // console.log(image);
    message.messageText = message.messageText.trim();
    console.log("IMAGES IN SEND MESSAGE ");
    console.log(images);
    if (images) message.images = images;
    console.log("MESAGE TO SEND: ",message);
    console.log(message);
    if (message.messageText !== "" || message.images) {
      if (messageType === "group") {
        console.log("Sending to group");
        sendMessageToGroup({ id, message: message });
      } else {
        console.log("SENDING DIRECT MESSAGE");
        sendMessage.mutateAsync({ id, message: message });
      }
    }

    setImages([]);
    setMessage("");
    e.target.reset();
  };
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-transparent">
      {/* {errors?.comment?.message && (
        <p className="text-[10px] text-red-500">{errors.comment.message}</p>
      )} */}
      <form
        className="w-full flex gap-4 relative bg-transparent"
        onSubmit={handleSendMessage}
      >
        <BiSolidImageAdd
          className="violet absolute size-8 top-2 bottom-0 left-1 cursor-pointer"
          onClick={() => setOpen(true)}
        />
        {open && (
          <ImagePickerModal
            open={open}
            onClose={() => setOpen(false)}
            setImages={setImages}
          />
        )}
        <input
          className="w-full border rounded-lg px-10 py-2 my-0.5"
          id="messageText"
          name="messageText"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {message.length || images.length ? (
          <button>
            <IoIosSend className="violet size-6 md:size-8 hover:scale-110 active:transition-transform active:duration-200 active:-translate-y-2 active:translate-x-2" />
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default MessageInput;
