import React from "react";
import FileUploader from "../components/MultipleImagesUploader";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
import cancel from "../assets/cancel.svg";
const FullImageModal = ({ image, open, onClose }) => {
  console.log(image, open, onClose);
  return (
    <div
      className={`fixed inset-0 flex w-full h-full justify-center items-center z-10 ${
        open ? "visible bg-black/10" : "invisible"
      }`}
      onClick={onClose}
    >
      {open && (
        <div className="relative">
          {" "}
          <img
            src={image.path ? URL.createObjectURL(image) : image}
            alt="full-image"
            className="w-[90vw] h-[90vh] object-contain rounded-2xl"
          />
          <img className='size-10 absolute -top-7 -right-9 cursor-pointer' src={cancel} alt='close' onClick={onClose} />
        </div>
      )}
    </div>
  );
};

export default FullImageModal;
