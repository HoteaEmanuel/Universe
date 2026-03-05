import React from "react";
import ProfileCard from "../components/ProfileCard";
import { useAuthStore } from "../store/authStore";
import { FaEdit, FaUniversity, FaUserCircle } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { useState } from "react";
import ProfileImageModal from "../Modals/ProfileImageModal";
import { useUpdateBioMutation } from "../queryAndMutation/mutations/user-mutation";
import { set } from "mongoose";
import { CgProfile } from "react-icons/cg";
import { useEffect } from "react";
const EditProfile = () => {
  useEffect(() => {
    document.title = "Edit Profile";
  }, []);
  const { user } = useAuthStore();
  const [openEditProfilePicture, setOpenEditProfilePicture] = useState(false);
  const [onImageHover, setOnImageHover] = useState(false);
  const [bioError, setBioError] = useState("");
  const { mutate: updateBio } = useUpdateBioMutation();
  return (
    <div className="border m-10 rounded-2xl p-10">
      <div className="w-full flex flex-col gap-4 p-5">
        <img
          src={user?.profilePicture}
          alt="Profile"
          className={`size-30 rounded-full cursor-pointer ${onImageHover ? "opacity-70" : "opacity-100"}`}
          onMouseEnter={() => setOnImageHover(true)}
          onMouseLeave={() => setOnImageHover(false)}
          onClick={() => setOpenEditProfilePicture(true)}
        />
        {onImageHover && (
          <div className="absolute top-15">
            <h1 className="text-xs opacity-80 p-1 rounded-2xl">
              Change Profile Picture
            </h1>
          </div>
        )}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl">
            {user?.name} {user?.firstName + " " + user?.lastName}
          </h1>
        </div>
        <ProfileImageModal
          open={openEditProfilePicture}
          onClose={() => setOpenEditProfilePicture(false)}
          entityType="user"
        />
        <div className="flex items-center gap-2">
          <FaUniversity />
          <h1 className="font-semibold">{user?.university}</h1>
        </div>
        {user.major && (
          <div className="flex items-center gap-2">
            <PiStudentBold />
            <h1 className="font-semibold">{user?.major}</h1>
          </div>
        )}

        {!user.bio && (
          <div className="flex flex-col gap-4">
            <h1 className="italic text-sm">
              Show some love, give your bio a try!
            </h1>
          </div>
        )}
        <div>
          <h1 className="font-semibold mb-2">Bio:</h1>
        </div>
        {bioError &&
          document.getElementById("bio").value.trim().length === 0 && (
            <p className="text-red-500 text-sm font-semibold">{bioError}</p>
          )}
        <textarea
          className="w-1/2 border-2 border-violet-950 rounded-md p-2"
          placeholder="Write your bio here..."
          rows={4}
          id="bio"
          defaultValue={user?.bio || ""}
        ></textarea>
        <button
          className="p-2 bg-violet-700 text-white w-30 mx-auto rounded-2xl hover:bg-violet-500"
          onClick={() => {
            if (
              document.getElementById("bio").value.trim().length === 0 &&
              !user?.bio
            ) {
              setBioError("Bio cannot be empty.");
              return;
            }
            updateBio(document.getElementById("bio").value || user?.bio);
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
