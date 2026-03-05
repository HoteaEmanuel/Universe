import React from "react";
import { useForm } from "react-hook-form";
import { IoMdSend } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useSendCommentMutation } from "../queryAndMutation/mutations/comment-mutation";
const CommentInput = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const { mutate: sendCommentMutation } = useSendCommentMutation(id);
  const onSubmit = async (data) => {
    console.log({ id, comment: data.comment });
    sendCommentMutation({ postId: id, comment: data.comment });
    reset();
  };
  return (
    <div className="sticky bottom-1 top-0 right-0 left-0">
      {errors?.comment?.message && (
        <p className="text-xs text-red-500 py-1">{errors.comment.message}</p>
      )}
      <form className="w-full flex gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full border rounded-lg p-2 commentsContainer"
          {...register("comment", {
            required: "Enter a non empty comment",
            validate: (comment) => {
              if (comment.trim() === "") return "Enter a valid comment";
            },
          })}
          placeholder="Send a message"
        />
        <button>
          <IoMdSend className="violet size-5" />
        </button>
      </form>
    </div>
  );
};

export default CommentInput;
