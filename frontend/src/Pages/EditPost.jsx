import React, { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../queryAndMutation/mutations/post-mutation";
import { useGetPostQuery } from "../queryAndMutation/queries/post-queries";
import { useAuthStore } from "../store/authStore";
import MultipleImagesUploader from "../components/MultipleImagesUploader";

const EditPost = () => {
  useEffect(() => {
    document.title = "Edit Post";
  }, []);
  const { id } = useParams();
  const { user } = useAuthStore();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imageError, setImageError] = useState("");

  const { data: post, isPending } = useGetPostQuery(id, user?._id);
  const updatePostMutation = useUpdatePostMutation(user?._id);
  const deletePostMutation = useDeletePostMutation(id, user?._id);
  useEffect(() => {
    if (post?.imagesUrls) {
      setFiles(post.imagesUrls);
    }
  }, [setFiles, post?.imagesUrls]);

  if (isPending) return <p>Loading...</p>;
  const onSubmit = async (data) => {
    data.images = files;
    data.id = id;
    if (files[0] === undefined) {
      setImageError("Add an image");
      return;
    }
    updatePostMutation.mutate(data);
    navigate("/profile");
  };
  if (isPending) return <p>Fetching the post data</p>;

  console.log("POST: ",post);
  return (
    <section className="w-full h-full ">
      <form
        className="flex flex-1 flex-col justify-center gap-4 w-full p-10 md:px-20 violet"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center">
          <FaEdit className="size-10 text-violet-900" />
          <h1 className="px-2 text-3xl">Edit the post</h1>
        </div>
        <label className="text">Add title</label>
        {errors.title && <p className="text-red-400">{errors.title.message}</p>}
        <input
          {...register("title", { required: "Title is required" })}
          defaultValue={post?.title}
          className="input"
        />
        {errors.body && <p className="text-red-400">{errors.body.message}</p>}
        <textarea
          maxLength={2200}
          className="input resize-none"
          rows={10}
          {...register("body", {
            required: "The body is required",
            validate: (v) => {
              if (v.length > 2200 || v.length < 5)
                return "The body should have 5-2200 characters";
              return true;
            },
          })}
          defaultValue={post?.body}
        ></textarea>
        <label className="text">Add images</label>
        {errors.images && (
          <p className="text-red-500">{errors.images.message}</p>
        )}
        {imageError && !files[0] && (
          <p className="text-red-500">{imageError}</p>
        )}
        <MultipleImagesUploader setFiles={setFiles} files={files} />

        <label className="text">Add location</label>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        <input
          {...register("location", {
            validate: (v) => {
              if (v.length > 100)
                return "The location should have between 2-100 characters";
              return true;
            },
          })}
          className="input"
          defaultValue={post.location}
        />
        <label className="text">Add tags</label>
        {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
        <input
          {...register("tags", {
            required: "Add a tag",
            validate: (v) => {
              if (v.length === 0) return "Add a tag";
              return true;
            },
          })}
          className="input"
          placeholder="Event, Learn, Explore"
          defaultValue={post.tags}
        />
        <div className="flex justify-end gap-4">
          <button
            className="text-lg p-2 px-4  border rounded-xl hover:scale-105"
            type="button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
          <button
            className="text-lg p-2 px-4  border bg-red-500 text-white rounded-xl hover:scale-105"
            type="button"
            onClick={() => {
              deletePostMutation.mutate();
              navigate("/profile");
            }}
          >
            Delete
          </button>
          <button className="text-lg shadow p-2 px-4 rounded-xl text-white hover:scale-105 self-center bg-violet-950">
            {isSubmitting ? "Updating the post..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditPost;
