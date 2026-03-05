import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/authStore";
import { FaUserCircle } from "react-icons/fa";
import { formatDateDetailed } from "../utils/formatDate";
import { useEffect, useRef } from "react";
import { CiCircleRemove } from "react-icons/ci";
import cancel from "../assets/cancel.svg";
import FullImageModal from "../Modals/FullImageModal";
import { formatToLocalDate } from "../utils/formatDateToLocal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageOptionsModal from "../Modals/MessageOptionsModal";
import { urlPathName } from "../utils/urlPathFromName";

import { RiArrowDropDownLine } from "react-icons/ri";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const GroupConversationLayout = ({ group, messages }) => {
  const { user } = useAuthStore();
  // const { messages, getLiveMessages, getMessages } = useConversationStore();
  const messageEnd = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (messageEnd.current && messages) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  console.log(messages);
  return (
    <div className=" max-h-[60%] md:h-[80%] relative overflow-y-auto p-1">
      <div className="w-full h-[70vh] sm:h-[75vh] overflow-y-auto conversationContainer rounded-2xl p-2 my-1">
        <h1 className="text-center opacity-70 text-xs">
          Group created at {formatToLocalDate(group.createdAt)}{" "}
        </h1>
        <ul className="flex flex-col gap-4 ">
          {messages && messages.length ? (
            messages.map((message) => (
              <li
                key={message._id}
                className={`chat flex w-full p-2 ${
                  user._id === message.senderId._id
                    ? "justify-end"
                    : "justify-start"
                }`}
                ref={messageEnd}
                onClick={() => {
                  console.log("ON CLICK:");
                  console.log(message.senderId);
                  if (message.senderId._id === user._id) {
                    console.log("YUP");
                    setSelectedMessage(message);
                  }
                }}
              >
                <div
                  className={`${
                    user._id === message.senderId._id
                      ? "chat-end"
                      : "chat-start"
                  } max-w-1/2`}
                >
                  {message.imagePublicId && (
                    <>
                      <img
                        className="max-h-2/3 max-w-2/3 md:max-w-sm "
                        src={`https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${message.imagePublicId}`}
                        onClick={() => setOpen(true)}
                      />
                      <FullImageModal
                        image={message.imagePublicId}
                        open={open}
                        onClose={() => setOpen(false)}
                      />
                    </>
                  )}
                  <div>
                    <div className="flex  gap-2 justify-end">
                      {user._id !== message.senderId._id &&
                      message.senderId?.profilePicture ? (
                        <img
                          src={message.senderId?.profilePicture}
                          className="size-12 rounded-full self-end shrink-0 cursor-pointer"
                          onClick={() =>
                            navigate(`/users/${urlPathName(message.senderId)}`)
                          }
                        />
                      ) : (
                        user._id !== message.senderId._id && (
                          <FaUserCircle
                            className="size-12 rounded-full self-end shrink-0 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/users/${urlPathName(message.senderId)}`,
                              )
                            }
                          />
                        )
                      )}

                      <div>
                        <div
                          className={`flex flex-col ${
                            user._id === message.senderId._id ? "items-end" : ""
                          }`}
                        >
                          <time className="text-[8px] py-1">
                            {!message.deleted &&
                              message.edited &&
                              `Edited: ${formatDateDetailed(message.updatedAt)}`}
                            {!message.deleted &&
                              !message.edited &&
                              formatDateDetailed(message.createdAt)}
                          </time>

                          <h1 className="text-sm font-semibold mb-1">
                            {message.senderId._id === user._id
                              ? "You"
                              : message.senderId?.firstName ||
                                message.senderId?.name}{" "}
                            {message.senderId?.lastName || ""}
                          </h1>
                          {message.content && (
                            <div
                              className="chat-bubble chat-bubble-primary max-w-full w-fit sm:w-full"
                              onMouseEnter={() => setShowOptions(message._id)}
                              onMouseLeave={() => setShowOptions(null)}
                            >
                              {showOptions === message._id && (
                                <RiArrowDropDownLine
                                  className={`absolute size-5 cursor-pointer ${
                                    selectedMessage?._id === message._id
                                      ? "text-violet-500"
                                      : "text-gray-300"
                                  } -right-1 -top-1`}
                                  onClick={() => {
                                    if (selectedMessage?._id === message._id) {
                                      setSelectedMessage(null);
                                    } else {
                                      setSelectedMessage(message);
                                    }
                                  }}
                                />
                              )}

                              {message.deleted ? (
                                <h1 className="text-sm text-right italic font-semibold">
                                  This message has been deleted
                                </h1>
                              ) : message.content ? (
                                <p> {message.content}</p>
                              ) : (
                                <h1 className="text-[10px] text-right italic">
                                  Edited
                                </h1>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <h1 className="text-center">No messages yet!</h1>
          )}
        </ul>
      </div>
      {selectedMessage && (
        <MessageOptionsModal
          open={selectedMessage}
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}

      {image && (
        <div className="relative">
          <img
            src={cancel}
            className="absolute size-5 text-red-500 -top-22 left-20 z-10 cursor-pointer"
            onClick={() => setImage(null)}
          />
          <img
            src={URL.createObjectURL(image)}
            alt="selected image"
            className="absolute size-20 -top-20 left-1"
          />
        </div>
      )}
      <div className="fixed bottom-20 sm:bottom-0 w-[90vw] md:w-[70vw]">
        <MessageInput image={image} setImage={setImage} messageType="group" />
      </div>
    </div>
  );
};

export default GroupConversationLayout;
