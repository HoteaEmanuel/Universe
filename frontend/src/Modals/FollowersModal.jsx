import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import UserListElement from "../components/UserListElement";
const FollowersModal = ({ open, onClose, followers }) => {

  console.log(followers);
  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto ${
        open ? "visible bg-black/50" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className="w-[90%] sm:w-1/3 h-full m-auto modalContainer">
        <IoIosCloseCircle
          className="ml-auto size-10 iconGray hover:scale-105 cursor-pointer"
          onClick={onClose}
        />
        <h1 className="text-center text-lg font-sans italic">Followers</h1>
        <ul className="p-2 flex flex-col gap-5 overflow-y-auto">
          {followers?.map((follower) => (
            <li
              key={follower._id}
            >
              <UserListElement user={follower} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowersModal;
