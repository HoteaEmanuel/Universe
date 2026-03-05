import React from "react";
import { useCreateGroupMutation } from "../queryAndMutation/mutations/group-mutation";
import { useForm } from "react-hook-form";
const CreateGroupModal = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  console.log("OPEN CREATE GROUP MODAL " + open);
  const { mutate: createGroup } = useCreateGroupMutation();
  const onSubmit = async (data) => {
    console.log(data);
    createGroup({
      name: data.groupName,
      description: data.groupDescription,
    });
    reset();
    onClose();
  };
  return (
    <div
      className={`fixed inset-0 w-full h-full m-auto flex justify-center ${
        open ? "visible bg-black/50" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className=" w-[90%] sm:w-1/2 rounded-2xl h-[55%] mt-20 modalContainer">
        <form
          className="flex flex-col p-4 gap-4"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.groupName && (
            <span className="text-red-500 text-xs font-bold">
              {errors.groupName.message}
            </span>
          )}
          <label className="text-lg">Group Name *</label>
          <input
            className="border p-2 rounded"
            {...register("groupName", {
              required: "Group name is required",
              minLength: {
                value: 3,
                message: "Group name must be at least 3 characters",
              },
            })}
          ></input>
          <label className="text-lg">Group Description</label>
          <textarea
            className="border p-2 rounded resize-none h-24"
            {...register("groupDescription")}
          ></textarea>
          {/* <button type="button" className="p-2 bg-gray-950 w-30 rounded" onClick={}>Add members</button> */}
          <div className="flex justify-center gap-10 mt-5">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btnViolet text-white hover:scale-105">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
