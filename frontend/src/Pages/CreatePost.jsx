import { BiSolidImageAdd } from "react-icons/bi";
import { useForm } from "react-hook-form";
import create_post from "../assets/create_post.svg";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCreatePostMutation } from "../queryAndMutation/mutations/post-mutation";
import { useGetAiHashtagsQuery } from "../queryAndMutation/queries/ai-queries";
import { useDebounce } from "../hooks/Debounce";
import MultipleImagesUploader from "../components/MultipleImagesUploader.jsx";
import { IoCreate } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
const CreatePost = () => {
  useEffect(() => {
    document.title = "Create Post";
  }, []);
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  //  const {createPost}=usePostStore();
  const debouncedSearch = useDebounce(caption, 1500);
  const { data: aiSuggestedHashTags, isLoading: isLoadingHashtags } =
    useGetAiHashtagsQuery(caption, debouncedSearch);
  //

  const { mutateAsync: createPost } = useCreatePostMutation();
  const [files, setFiles] = useState([]);
  const [imageError, setImageError] = useState("");
  const onSubmit = async (data) => {
    try {
      data.images = files;
      await createPost(data);
      navigate("/home");
    } catch (error) {
      throw new Error(error);
    }
  };
  console.log("FILES: ", files);
  console.log(caption.length);
  return (
    <div className="w-full h-full ">
      <form
        className="flex flex-1 flex-col justify-center gap-4 w-full p-10 md:px-20"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center">
          <FaEdit className="size-10 text-violet-900" />
          <h1 className="px-2 text-3xl">Create a post</h1>
        </div>
        {errors.caption && (
          <p className="text-red-400">{errors.caption.message}</p>
        )}
        <label className="text">Title*</label>
        <input
          {...register("title", {
            required: "A title is required",
            validate: (v) => {
              if (v.length < 2 || v.length > 100)
                return "The title should have between 2-100 characters";
              return true;
            },
          })}
          className="input"
        />
        {/* <label className="text">Description</label> */}
        {errors.body && <p className="text-red-400">{errors.body.message}</p>}
        <textarea
          rows={10}
          placeholder="Write something..."
          className="input resize-none overflow-x-hidden whitespace-pre-wrap break-words"
          {...register("body", {
            validate: (v) => {
              if (v.length > 5000)
                return "The body should have less than 5000 characters";
              return true;
            },
          })}
          onChange={(e) => setCaption(e.target.value)}
        />
        <label className="text">Add images</label>
        {errors.images && (
          <p className="text-red-500">{errors.images.message}</p>
        )}
        {imageError && files.length === 0 && (
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
                return "The location should have less than 100 characters";
              return true;
            },
          })}
          className="input"
        />
        <label className="text">
          Add tags <span className="text-xs"> (space separated)</span>
        </label>
        {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}
        <input
          {...register("tags", {
            required: "Add a tag",
            validate: (v) => {
              if (v.length === 0) return "Add a tag";
              const regex = /^[A-Za-z0-9]+(, [A-Za-z0-9]+)*$/;
              if (!regex.test(v)) return "Tags should be space separated words";
              return true;
            },
          })}
          className="input"
          placeholder={
            aiSuggestedHashTags && aiSuggestedHashTags.hashtags
              ? aiSuggestedHashTags.hashtags.join(" ")
              : "Event Learn Explore"
          }
        />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="text-lg p-2 px-4  border rounded-xl hover:scale-105 "
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
          <button className="text-lg text-white shadow p-2 px-4 rounded-xl hover:scale-105 self-center bg-violet-700 ">
            {isSubmitting ? "Creating the post..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
