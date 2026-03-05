import React from "react";
import { useGetUsersWhoLikedPostQuery } from "../queryAndMutation/queries/post-queries";
import { FaUser, FaUserCircle } from "react-icons/fa";
import UserListElement from "../components/UserListElement";
import { IoIosCloseCircle } from "react-icons/io";
const LikesModal = ({ open, onClose, postId }) => {
  const { data, error, isLoading } = useGetUsersWhoLikedPostQuery(postId);
  if (isLoading) return <p>Loading likes...</p>;
  if (error) return <p>Error loading likes: {error.message}</p>;
  console.log(data);
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center ${
        open ? "visible bg-black/80" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className="modalContainer w-[90%] sm:w-1/2 h-[50%] px-5 rounded-2xl self-end" onClick={(e) => {e.stopPropagation(); e.preventDefault();}}>
      <IoIosCloseCircle
                className="ml-auto size-10 iconGray hover:scale-105 cursor-pointer"
                onClick={onClose}
              />
        <h1 className="text-2xl font-semibold">
          People who liked this post
        </h1>
        <ul className="mt-5 overflow-y-auto h-[80%]">
          {data.map((user) => (
            <li
              key={user._id}
            >
              <UserListElement user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LikesModal;
