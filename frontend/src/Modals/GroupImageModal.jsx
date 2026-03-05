import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useUpdateGroupImageMutation } from "../queryAndMutation/mutations/group-mutation";
import { useParams } from "react-router-dom";
const GroupImageModal = ({ open, onClose }) => {
    const { id } = useParams();
  const [file, setFile] = useState();
  const [error, setError] = useState(undefined);
  const { changeProfilePicture, user } = useAuthStore();
 const { mutateAsync: updateGroupImage,isPending } = useUpdateGroupImageMutation(id);
  const handleUpdateImage = async () => {
    try {
      if (!file) throw new Error("No image provided");
      await updateGroupImage(file);
      changeProfilePicture(URL.createObjectURL(file));
      console.log("USER AFTER PROFILE IMAGE UPDATE");
      console.log(user);
      setFile(null);
      onClose();
    } catch (error) {
      setError(error);
      throw new Error(error);
    }
  };
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center ${
        open ? "visible bg-black/80" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" w-[90%] sm:w-1/2 flex flex-col items-center justify-center container rounded-2xl p-2"
      >
        {error && <p className="text-red-500">{error.message}</p>}
        <ImageUploader setFile={setFile} file={file} classes="flex flex-col">
          <button
            className="p-2 shadow rounded-xl bg-linear-to-r from-violet-800 to-violet-600 text-gray-200 hover:scale-110"
            onClick={handleUpdateImage}
          >
            {isPending ? "Updating..." : "Change Image"}
          </button>
          <button
            className="p-2  rounded-xl shadow hover:scale-105 violet"
            onClick={onClose}
          >
            Close
          </button>
        </ImageUploader>
      </div>
    </div>
  );
};

export default GroupImageModal;
