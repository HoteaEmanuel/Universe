import React from "react";
import { useState } from "react";
import { useGetConvoUsers } from "../queryAndMutation/queries/conversation-queries";
import { useAddMemberToGroupMutation } from "../queryAndMutation/mutations/group-mutation";
import { useParams } from "react-router-dom";
import {
  useGetGroupMembers,
  useGetUsersFromSameUniversityNotInGroupQuery,
} from "../queryAndMutation/queries/group-queries";
import {
  useGetAllUsersQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../queryAndMutation/queries/user-queries";
import { useDebounce } from "../hooks/Debounce";
import { useQuery } from "@tanstack/react-query";
import UserListElement from "../components/UserListElement";
import { useAuthStore } from "../store/authStore";
const AddMembersModal = ({ onClose, open }) => {
  const { data: users } = useGetAllUsersQuery();
  const { user } = useAuthStore();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searched, setSearched] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 1500);
  const { id } = useParams();
  const { isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      let matchingUsers = [];
      const name = debouncedSearch.toLowerCase();
      matchingUsers = users.filter((value) => {
        const fullName =
          (value?.firstName?.toLowerCase() || value?.name?.toLowerCase()) +
          " " +
          (value?.lastName?.toLowerCase() || "");
        return fullName.includes(name);
      });
      setSearchedUsers(matchingUsers);
      setSearchTerm(debouncedSearch);
      setSearched(true);
      return matchingUsers;
    },
    enabled: debouncedSearch?.length > 2,
  });
  const { data: groupMembers, isLoading: isLoadingGroupMembers } =
    useGetGroupMembers(id);
  const { data: followers, isLoading: isLoadingFollowers } =
    useGetFollowersQuery(user._id);
  const { data: following, isLoading: isLoadingFollowing } =
    useGetFollowingQuery(user._id);
  const { data: convoUsers, isPending: isPendingUsers } = useGetConvoUsers();
  const groupId = useParams().id;
  const {
    data: usersFromSameUniversity,
    isLoading: isLoadingUsersFromSameUniversity,
  } = useGetUsersFromSameUniversityNotInGroupQuery(groupId);

  const { mutate: addMemberToGroupMutation } =
    useAddMemberToGroupMutation(groupId);
  if (
    isPendingUsers ||
    isLoadingUsersFromSameUniversity ||
    isLoadingUsers ||
    isLoadingFollowers ||
    isLoadingFollowing ||
    isLoadingGroupMembers
  ) {
    return;
  }

  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto flex justify-center items-center  ${
        open ? "visible bg-black/50 shadow-lg" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        className="w-1/2 h-[90%] modalContainer p-5 rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold">Add Members</h1>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 rounded mt-4 mb-4 border"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="h-[80%] overflow-y-auto">
          {convoUsers?.length > 0 && <p>Users from your conversations</p>}
          {convoUsers && convoUsers.length > 0 && (
            <ul className="flex flex-col gap-4">
              {convoUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between p-2 border-b border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture}
                      className="size-12 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold">
                        {(user?.firstName || user?.name) + " " + (user?.lastName || "")}
                      </h2>
                    </div>
                  </div>
                  <button
                    className="bg-violet-700 text-white px-4 py-2 hover:scale-105 rounded-lg"
                    onClick={() => addMemberToGroupMutation(user._id)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
          {usersFromSameUniversity && (
            <p className="mt-6">Users from your university</p>
          )}
          {usersFromSameUniversity && usersFromSameUniversity.length > 0 && (
            <ul className="flex flex-col gap-4">
              {usersFromSameUniversity.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between p-2 border-b border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profilePicture}
                      className="size-12 rounded-full"
                    />
                    <div>
                      <h2 className="font-semibold">
                        {user.name}{" "}
                        {user.accountType === "normal" ? user.lastName : ""}
                      </h2>
                    </div>
                  </div>
                  <button
                    className="bg-violet-700 text-white px-4 py-2 hover:scale-105 rounded-lg"
                    onClick={() => addMemberToGroupMutation(user._id)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchedUsers.length > 0 && (
            <>
              <h1>Search Results</h1>
              <ul>
                {searchedUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between p-2 border-b border-gray-700"
                  >
                    <UserListElement user={user} />
                    {groupMembers.some(
                      (member) => member.memberId._id === user._id
                    ) ? (
                      <p>Already Added</p>
                    ) : (
                      <button
                        className="bg-violet-700 text-white px-4 py-2 hover:scale-105 rounded-lg"
                        onClick={() => addMemberToGroupMutation(user._id)}
                      >
                        Add
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          {followers && followers.length > 0 && (
            <div>
              <p className="mt-6">Your Followers</p>
              <ul className="flex flex-col gap-4">
                {followers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between p-2 border-b border-gray-700"
                  >
                    <UserListElement user={user} />
                    <button
                      className="bg-violet-700 text-white px-4 py-2 hover:scale-105 rounded-lg"
                      onClick={() => addMemberToGroupMutation(user._id)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {following && following.length > 0 && (
            <div>
              <p className="mt-6">People You Follow</p>
              <ul className="flex flex-col gap-4">
                {following.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between p-2 border-b border-gray-700"
                  >
                    <UserListElement user={user} />
                    <button
                      className="bg-violet-700 text-white px-4 py-2 hover:scale-105 rounded-lg"
                      onClick={() => addMemberToGroupMutation(user._id)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
