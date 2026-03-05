import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { RiImageAddFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import cancel from "../assets/cancel.svg";
import { useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import FullImageModal from "../Modals/FullImageModal";

const MultipleImagesUploader = ({ setFiles, files,classes, children }) => {
  console.log("FILES IN UPLOADER: ", files);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const droppedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      if (files?.length + droppedFiles.length > 10) {
        toast.error("You can only upload up to 10 images");
        return;
      }
      setFiles((prev) => [...prev, ...droppedFiles]);
    },
    [setFiles, files],
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
    setFiles((prev) => prev.filter((file) => file !== image));
  };
  return (
    <div className={`violet uploader p-4 rounded-xl ${classes}`}>
      <div
        {...getRootProps({
          className: "flex flex-col items-center justify-center p-5 rounded-xl",
        })}
      >
        <RiImageAddFill className="w-10 h-10" />
        <h1 className="text-lg text-gray-500">Drag images</h1>
        <input type="file" {...getInputProps()} />
        <p className="text-xs pb-4 text-gray-400">Jpg, Png, Jpeg, Svg files</p>
        <button
          type="button"
          className="text-xs border p-2 rounded-xl text-gray-200 bg-violet-950 hover:scale-105"
        >
          Select images from computer
        </button>
        {files?.length > 10 && (
          <p className="text-red-500 text-xs mt-2">
            You can only upload up to 10 images
          </p>
        )}
      </div>
      <ul className="flex justify-center">
        {files &&
          files.map((file) => {
            const preview = file.path ? URL.createObjectURL(file) : file;
            return (
              <li key={file?.name}>
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
                    src={preview}
                    className="size-30 md:size-50 rounded-xl p-2"
                    onClick={() => {
                      setFullImage(file);
                      setOpenFullImageModal(true);
                    }}
                  />
                </div>
              </li>
            );
          })}
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

export default MultipleImagesUploader;
