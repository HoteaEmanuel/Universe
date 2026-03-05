import React from "react";
import { useLeaveGroupMutation } from "../queryAndMutation/mutations/group-mutation";
import { useNavigate, useParams } from "react-router-dom";
const LeaveGroupWarningModal = ({ onClose, open }) => {
  const { id } = useParams();
  const { mutate: leaveGroup } = useLeaveGroupMutation();
  const navigate = useNavigate();
  console.log(id);
  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto flex justify-center items-center  ${
        open ? "visible bg-black/90 shadow-lg" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className="w-[90%] sm:w-1/2 h-[50%] modalContainer p-5 rounded-md flex justify-center items-center flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold">
          Are you sure you want to leave the group?
        </h1>
        <p>This action cannot be undone.</p>
        <p>You can rejoin only if added by an admin.</p>
        <div className="flex gap-4 mt-10">
          <button
            className="p-2 shadow rounded-xl bg-linear-to-r from-red-800 to-red-600 text-gray-200 hover:scale-110"
            onClick={() => {
              leaveGroup(id);
              navigate("/chat");
              onClose();
            }}
          >
            Leave Group
          </button>
          <button
            className="p-2  rounded-xl shadow hover:scale-105 violet"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGroupWarningModal;
