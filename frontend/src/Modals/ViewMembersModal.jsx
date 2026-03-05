import React from "react";
import { useGetGroupMembers } from "../queryAndMutation/queries/group-queries";
import UserListElement from "../components/UserListElement";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCheckUserIsAdminQuery } from "../queryAndMutation/queries/group-queries";
import { usePromoteMemberToAdminMutation } from "../queryAndMutation/mutations/group-mutation";
const ViewMembersModal = ({ onClose, open }) => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { data: groupMembers, isLoading, error } = useGetGroupMembers(id);
  const { data: isAdmin, isLoading: isAdminLoading } = useCheckUserIsAdminQuery(
    id,
    user._id,
  );
  const { mutate: promoteMemberToAdmin } = usePromoteMemberToAdminMutation(id);
  if (isLoading) return <p>Loading...</p>;
  console.log(groupMembers);

  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto flex justify-center items-center  ${
        open ? "visible bg-black/70 shadow-lg" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className="w-[90%] sm:w-1/2 h-[90%] modalContainer p-5 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold">Group Members</h1>
        <ul className="flex flex-col gap-4 mt-10">
          {groupMembers && groupMembers.length > 0 ? (
            groupMembers.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between p-2 border-b w-full"
              >
                <UserListElement user={member.memberId} />
                {member.role === "member" && isAdmin && (
                  <button
                    className="btn text-white bg-violet-700"
                    onClick={() => promoteMemberToAdmin(member.memberId)}
                  >
                    Make Admin
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>No members found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ViewMembersModal;
