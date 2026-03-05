import React from "react";
import AddMembersModal from "./AddMembersModal";
import { useState } from "react";
import { useGetGroupMemberById } from "../queryAndMutation/queries/group-queries";
import { useParams } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import ViewMembersModal from "./ViewMembersModal";
import LeaveGroupWarningModal from "./LeaveGroupWarningModal";
const GroupMenuModal = ({ onClose, open }) => {
  const [addMembersModal, setAddMembersModal] = useState(false);
  const [viewMembersModal, setViewMembersModal] = useState(false);
  const [leaveGroupWarningModal, setLeaveGroupWarningModal] = useState(false);

  const id = useParams().id;
  const { data: member, isPending } = useGetGroupMemberById(id);
  if (isPending) return <p>Loading...</p>;
  console.log(member);
  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto flex justify-center  ${
        open ? "visible shadow-black/50 shadow-lg" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className="absolute p-4 w-[90%] sm:w-1/2 rounded-md modalContainer top-16 right-16 shadow-lg border border-gray-800">
        <ul className="flex flex-col">
          {member?.role === "admin" && (
            <li
              className="flex items-center gap-2 p-2 hoverGray rounded-lg cursor-pointer"
              onClick={() => {
                setAddMembersModal(true);
                onClose();
              }}
            >
              <MdOutlineGroupAdd className="size-5" />
              Add Members
            </li>
          )}
          <li
            className=" flex items-center gap-2 p-2 hoverGray rounded-lg cursor-pointer"
            onClick={() => setViewMembersModal(true)}
          >
            <MdGroups className="size-5" />
            View Members
          </li>
          <li
            className=" flex items-center gap-2 p-2 hoverGray rounded-lg cursor-pointer"
            onClick={() => setLeaveGroupWarningModal(true)}
          >
            <IoIosLogOut className="size-5" />
            Leave Group
          </li>
        </ul>
        <AddMembersModal
          open={addMembersModal}
          onClose={() => setAddMembersModal(false)}
        />
        <ViewMembersModal
          open={viewMembersModal}
          onClose={() => setViewMembersModal(false)}
        />
        <LeaveGroupWarningModal
          open={leaveGroupWarningModal}
          onClose={() => setLeaveGroupWarningModal(false)}
        />
      </div>
    </div>
  );
};

export default GroupMenuModal;
