import React from "react";
import StartConversationMessageInput from "./StartConvoMessageInput";

const NewConversationLayout = () => {

  return (
    <div className="h-screen relative p-5">
      <h1 className="text-2xl py-2">Start a new conversation</h1>
      <div className="w-full h-3/4 rounded-2xl p-2 my-2 flex justify-center">
        <h1>No messages yet! Say hi :)</h1>
      </div>
      <div className="px-10 relative"></div>
      <StartConversationMessageInput />
    </div>
  );
};

export default NewConversationLayout;
