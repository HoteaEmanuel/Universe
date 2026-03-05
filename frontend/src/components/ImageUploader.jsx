import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { RiImageAddFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import cancel from "../assets/cancel.svg";
import { useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import FullImageModal from "../Modals/FullImageModal";

const ImageUploader = ({ setFile, file, classes, children }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const droppedFile = acceptedFiles[0];
      if (file) {
        toast.error("You can only upload one image");
        return;
      }
      setFile(droppedFile);
    },
    [setFile, file],
  );

  const [fullImage, setFullImage] = useState(null);
  const [openFullImageModal, setOpenFullImageModal] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  const handleRemoveImage = (image) => {
    setFile(null);
  };
  return (
    <div className={`violet uploader p-4 rounded-xl ${classes}`}>
      <div
        {...getRootProps({
          className: "flex flex-col items-center justify-center p-5 rounded-xl",
        })}
      >
        <RiImageAddFill className="w-10 h-10" />
        <h1 className="text-lg text-gray-500">Drag image</h1>
        <input type="file" {...getInputProps()} />
        <p className="text-xs pb-4 text-gray-400">Jpg, Png, Jpeg, Svg files</p>
        <button
          type="button"
          className="text-xs border p-2 rounded-xl text-gray-200 bg-violet-950 hover:scale-105"
        >
          Select image from computer
        </button>
      </div>
      <ul className="flex justify-center">
        {file && (
          <li>
            <div className="relative">
              <button
                className="absolute -top-1 left-[90%] hover:scale-110"
                type="button"
                onClick={() => handleRemoveImage(file)}
              >
                <img
                  src={cancel}
                  className="text-red-600 w-10 h-8 hover:text-red-500 cursor-pointer"
                />
              </button>
              <img
                src={URL.createObjectURL(file)}
                className="size-30 md:size-50 rounded-xl p-2"
                onClick={() => {
                  setFullImage(file);
                  setOpenFullImageModal(true);
                }}
              />
            </div>
          </li>
        )}
        <FullImageModal
          image={fullImage}
          open={openFullImageModal}
          onClose={() => setOpenFullImageModal(false)}
        />
        <FullImageModal
          image={fullImage}
          open={openFullImageModal}
          onClose={() => setOpenFullImageModal(false)}
        />
      </ul>
      <div className="w-full flex justify-center gap-5">{children}</div>
    </div>
  );
};

export default ImageUploader;
