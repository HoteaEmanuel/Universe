import React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { User } from "../../../backend/models/user.model";
import UserListElement from "../components/UserListElement.jsx";
const FollowingModal = ({ open, onClose, following }) => {
  console.log(following);
  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto ${
        open ? "visible bg-black/50" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className="w-[90%] sm:w-1/3 h-full m-auto modalContainer">
        <IoIosCloseCircle
          className="ml-auto size-8 iconGray hover:scale-105 cursor-pointer"
          onClick={onClose}
        />
        <h1 className="text-center text-lg font-sans italic">Following</h1>
        <ul className="p-2 flex flex-col gap-5 overflow-y-auto">
          {following?.map((following) => (
            <li key={following?._id}>
              <UserListElement user={following} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowingModal;
