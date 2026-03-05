import React from "react";
import FileUploader from "../components/MultipleImagesUploader";
import { useState } from "react";
import MultipleImagesUploader from "../components/MultipleImagesUploader";
const ImagePickerModal = ({ open, onClose, setImages }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(undefined);
  const handleUpdateImage = async (e) => {
    e.preventDefault();
    try {
      if (files.length === 0) throw new Error("No image provided");
      setImages([...files]);
      onClose();
    } catch (error) {
      setError(error);
      throw new Error(error);
    }
  };
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center ${
        open ? "visible bg-black/50" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] sm:w-1/2 flex flex-col items-center justify-center container rounded-2xl p-2"
      >
        {error && <p className="text-red-500">{error.message}</p>}
        <MultipleImagesUploader setFiles={setFiles} files={files} classes="flex flex-col">
          <button
            className="p-2 shadow rounded-xl bg-linear-to-r from-violet-800 to-violet-600 text-gray-200 hover:scale-110"
            onClick={handleUpdateImage}
          >
            Select Images
          </button>
          <button
            className="p-2  rounded-xl shadow hover:scale-105 violet"
            onClick={onClose}
          >
            Close
          </button>
        </MultipleImagesUploader>
      </div>
    </div>
  );
};

export default ImagePickerModal;
