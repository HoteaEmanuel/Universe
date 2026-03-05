import React from "react";
import { FaUniversity, FaUserCircle } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { getFullName } from "../utils/fullName";
import { useState } from "react";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../queryAndMutation/queries/user-queries";
import FollowersModal from "../Modals/FollowersModal";
import FollowingModal from "../Modals/FollowingModal";
import { useAuthStore } from "../store/authStore";
import ProfileImageModal from "../Modals/ProfileImageModal";

const Profile = ({ user }) => {
  const { user: authUser } = useAuthStore();
  const [openFollowersModal, setOpenFollowersModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);
  const { data: followers } = useGetFollowersQuery(user?._id);
  const { data: following } = useGetFollowingQuery(user?._id);
  const [open, setOpen] = useState(false);
  const [onImageHover, setOnImageHover] = useState(false);

  console.log("USER : ", user);
  console.log("AUTH USER:", authUser);
  return (
    <div className="flex justify-center">
      <div className="flex flex-col relative group justify-center items-center">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="user"
            className="size-25 rounded-full mr-2"
            onClick={() => {
              if (authUser?._id === user?._id) {
                setOpen(true);
              }
            }}
            onMouseEnter={() => {
              if (authUser?._id === user?._id) {
                setOnImageHover(true);
              }
            }}
            onMouseLeave={() => {
              if (authUser?._id === user?._id) {
                setOnImageHover(false);
              }
            }}
          />
        ) : (
          <FaUserCircle className="size-20 text-gray-300" />
        )}

        {onImageHover && (
          <div className="relative w-full">
            <div className="absolute top-0 right-0 p-2 z-10">
              <p className="text-[8px] text-center mb-2 border rounded-md p-1">
                Change Profile Picture
              </p>
            </div>
          </div>
        )}

        {open && (
          <div className="absolute z-10">
            <ProfileImageModal open={open} onClose={() => setOpen(false)} />
          </div>
        )}
      </div>

      <div className="w-full flex flex-col justify-center gap-1 px-1">
        {user.accountType === "business" && (
          <div className="flex items-center">
            <img
              src={"/images/verify.png"}
              alt="verified badge"
              className="size-5 inline-block"
            />
            <p className="px-1 text-sm italic">Verified</p>
          </div>
        )}
        <h1 className="text-lg font-semibold px-1">{getFullName(user)}</h1>

        {user.accountType === "normal" && (
          <div className="flex items-center">
            <FaUniversity className="inline-block size-5 mr-2" />
            <p className="text-[10px] font-sans px-2 font-semibold">
              {user?.university || "No university specified"}
            </p>
          </div>
        )}
        {user?.major && (
          <div className="flex items-center">
            <PiStudentFill className="inline-block size-5 mr-2" />
            <p className="text-[10px] font-sans px-2 font-semibold">
              {user.major}
            </p>
          </div>
        )}
        {user?.bio && (
          <div className="flex items-center">
            <h1 className="font-semibold text-xs">Bio:</h1>
            <p className="text-xs md:text-sm font-sans px-2 font-semibold">
              {user.bio}
            </p>
          </div>
        )}
        <div className="flex gap-5 text-xs p-1">
          <button
            className="flex gap-2"
            onClick={() => {
              (setOpenFollowersModal(true), setOpenFollowingModal(false));
            }}
          >
            <p>{followers?.length}</p>
            <h1>Followers</h1>
          </button>
          <button
            className="flex gap-2"
            onClick={() => setOpenFollowingModal(true)}
          >
            <p>{following?.length}</p>
            <h1>Following</h1>
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-2 z-10">
        {followers && followers.length > 0 && (
          <FollowersModal
            open={openFollowersModal}
            onClose={() => setOpenFollowersModal(false)}
            followers={followers}
          />
        )}

        {following && following.length > 0 && (
          <FollowingModal
            open={openFollowingModal}
            onClose={() => setOpenFollowingModal(false)}
            following={following}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
