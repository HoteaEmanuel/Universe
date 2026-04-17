import React from "react";
import { BiSearch } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/Debounce";
import { useGetAllUsersQuery } from "../queryAndMutation/queries/user-queries";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoChevronBackCircle } from "react-icons/io5";
import CreateGroupModal from "../Modals/CreateGroupModal";
const NewConversation = () => {
  const navigate = useNavigate();
  const { data: users } = useGetAllUsersQuery();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searched, setSearched] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 1500);
  const [open, setOpen] = useState(false);

  const { isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      let matchingUsers = [];
      const name = debouncedSearch.toLowerCase();
      matchingUsers = users.filter((value) => {
        const fullName =
          (value?.firstName?.toLowerCase() || value?.name?.toLowerCase()) + " " + (value?.lastName?.toLowerCase() || "");
        return fullName.includes(name);
      });
      setSearchedUsers(matchingUsers);
      setSearchTerm(debouncedSearch);
      setSearched(true);
      return matchingUsers;
    },
    enabled: debouncedSearch?.length > 2,
  });
  if (isLoadingUsers) return <p>Loading...</p>;
  return (
    <div className="p-10">
      <IoChevronBackCircle
        className="size-10 mb-10 text-violet-900 hover:scale-105 cursor-pointer"
        onClick={() => navigate("/chat")}
      />

      <div className="relative">
        <BiSearch className="absolute size-5 top-4 left-2" />
        <input
          type="text"
          placeholder="Search for any user"
          className="p-3 pl-8 mb-10 border rounded-2xl w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searched && searchedUsers.length === 0 && (
        <p>No users found for "{searchTerm}"</p>
      )}
      {searched && searchedUsers.length > 0 && (
        <ul className="flex flex-col gap-5 mb-10">
          {searchedUsers.map((user) => (
            <li
              className="border p-2 rounded-2xl flex gap-2 hover:bg-gray-800"
              key={user._id}
              onClick={() => navigate(`/new-conversation/${user._id}`)}
            >
              <img src={user.profilePicture} className="icon rounded-full" />

              <h1>
                {(user?.firstName || user?.name) +
                  " " +
                  (user.accountType === "normal" ? user?.lastName : "")}
              </h1>
            </li>
          ))}
        </ul>
      )}
      <button
        className="p-2 bg-violet rounded-2xl flex items-center text-white"
        onClick={() => setOpen(true)}
      >
        <MdGroups className="size-5 mr-2 inline-block" />
        Create a group
      </button>
      <CreateGroupModal open={open} onClose={()=>setOpen(false)}/>
    </div>
  );
};

export default NewConversation;
