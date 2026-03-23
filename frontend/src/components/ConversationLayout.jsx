import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/authStore";
import { formatDateDetailed } from "../utils/formatDate";
import { useEffect, useRef } from "react";
import { useState } from "react";
import cancel from "../assets/cancel.svg";
import FullImageModal from "../Modals/FullImageModal";
import MessageOptionsModal from "../Modals/MessageOptionsModal";
const ConversationLayout = ({ messages }) => {
  const { user } = useAuthStore();

  const [imageToFull, setImageToFull] = useState(null);

  const messageEnd = useRef(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAddedImages, setOpenAddedImages] = useState(false);

  useEffect(() => {
    if (messageEnd.current && messages) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className=" max-h-[85%] md:h-screen relative p-1  overflow-x-hidden">
      <div className="w-full h-[80vh] md:h-[75vh] overflow-y-auto rounded-2xl p-2 my-1 conversationContainer">
        <ul className="flex flex-col gap-4 ">
          {messages.length ? (
            messages.map((message) => (
              <li
                key={message._id}
                className={`chat flex w-full p-2 ${
                  user._id === message.senderId
                    ? "justify-end"
                    : "justify-start"
                }`}
                ref={messageEnd}
                onClick={() => {
                  if (message.senderId === user._id) {
                    setSelectedMessage(message);
                  }
                }}
              >
                <div
                  className={`${
                    user._id === message.senderId ? "chat-end" : "chat-start"
                  }`}
                >
                  {message?.deleted === false && message.imageUrls?.length > 0 && (
                    <ul>
                      {message.imageUrls.map((image, index) => (
                        <li key={index} className="flex justify-start py-1">
                          <img
                            className="max-h-2/3 max-w-2/3 md:max-w-xs "
                            src={image}
                            onClick={() => {
                              setImageToFull(image);
                              setOpen(true);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex  gap-2 min-w-0">
                    <div className="flex flex-col">
                      <time className="text-[8px] py-1">
                        {!message.deleted &&
                          message.edited &&
                          `Edited: ${formatDateDetailed(message.updatedAt)}`}
                        {!message.deleted &&
                          !message.edited &&
                          formatDateDetailed(message.createdAt)}
                      </time>
                      {message?.content && (
                        <div className="chat-bubble chat-bubble-primary max-w-full w-fit sm:w-full">
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

                      {message?.images?.length > 0 && (
                        <div className="chat-bubble chat-bubble-primary max-w-full w-fit sm:w-full">
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
              </li>
            ))
          ) : (
            <h1>No messages yet!</h1>
          )}
        </ul>
      </div>
      <FullImageModal
        image={imageToFull}
        open={open}
        onClose={() => {
          setOpen(false);
          setImageToFull(null);
        }}
      />
      <div ref={messageEnd} />
      <MessageOptionsModal
        open={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        message={selectedMessage}
      />
      {images?.length > 0 && (
        <ul className="w-full flex">
          {images.map((image) => (
            <li className="relative w-10" key={image.path}>
              <img
                src={cancel}
                className="absolute size-5 text-red-500 -top-10 -right-3 z-10 cursor-pointer"
                onClick={() =>
                  setImages((prev) => prev.filter((img) => img !== images[0]))
                }
              />
              <img
                src={URL.createObjectURL(image)}
                alt="selected image"
                className="absolute size-10 -top-10 left-1"
                onClick={() => {
                  setImageToFull(image);
                  setOpenAddedImages(true);
                }}
              />
              <FullImageModal
                image={imageToFull}
                open={openAddedImages}
                onClose={() => {
                  setOpenAddedImages(false);
                  setImageToFull(null);
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="fixed bottom-20 sm:bottom-0 w-[90vw] md:w-[70vw]">
        <MessageInput
          images={images}
          setImages={setImages}
          messageType="direct"
        />
      </div>
    </div>
  );
};

export default ConversationLayout;
