import React from "react";
import ProfileCard from "../components/ProfileCard";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import ConversationLayout from "../components/ConversationLayout";
import { useGetUserByIdQuery } from "../queryAndMutation/queries/user-queries";
import NewConversationLayout from "../components/NewConversationLayout";
const NewConvo = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { data: user, isPending: isPendingUser } = useGetUserByIdQuery(userId);

  if (isPendingUser) return <p>Loading...</p>;
  console.log("USER IN CONVO:" + user.firstName + user.lastName);
  return (
    <div className="w-full overflow-y-hidden">
      <div className="flex justify-center gap-1 w-full p-5">
        <div className="flex flex-col">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="user"
              className="size-20 rounded-full mr-2 cursor-pointer"
              onClick={() => navigate(`/user/profile/${user._id}`)}
            />
          ) : (
            <FaUserCircle className="size-20 text-gray-300 cursor-pointer" />
          )}
        </div>

        <div className="w-full">
          {user.accountType === "business" && (
            <img
              src={"/images/verify.png"}
              alt="verified badge"
              className="size-5 inline-block ml-2"
            />
          )}
          {user.accountType === "normal" && (
            <p className="text-xss md:text-sm font-sans px-2">
              {user?.university || "No university specified"}
            </p>
          )}
          <h1 className="text-lg lg:text-2xl font-semibold p-2">
            {user?.firstName || user?.name + " " + (user.accountType === "normal" ? user?.lastName : "")}
          </h1>
        </div>
      </div>
      <NewConversationLayout></NewConversationLayout>
    </div>
  );
};

export default NewConvo;
