import React from "react";
import { useGetUserByIdQuery } from "../queryAndMutation/queries/user-queries";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { formatDateDetailed } from "../utils/formatDate";
import { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useDeleteCommentMutation, useRemoveLikeCommentMutation, useLikeCommentMutation } from "../queryAndMutation/mutations/comment-mutation";
const Comment = ({ comment }) => {
  const { userId } = comment;
  const { user: authUser } = useAuthStore();
  const { data: user, isPending: isPendingUser } = useGetUserByIdQuery(userId);
  const [isSelected, setIsSelected] = useState(false);
  const deleteComment = useDeleteCommentMutation();
  const likeComment = useLikeCommentMutation();
  const removeLikeComment =  useRemoveLikeCommentMutation();
  const [liked, setLiked] = useState(comment.isLiked);
  if (isPendingUser) return <p>Loading...</p>;
  return (
    <div
      className="w-full flex p-1 relative items-center"
      onClick={() => setIsSelected((prev) => !prev)}
    >
      <Link
        to={
          authUser._id !== user._id ? `/user/profile/${user._id}` : "/profile"
        }
      >
        <img
          className="profile-icon cursor-pointer"
          src={user.profilePicture}
          alt="user profile image"
        />
      </Link>

      <div className="text-xs w-full">
        <p className="font-semibold px-1">
          {authUser._id === user._id
            ? "You"
            : `${user.firstName || user.name} ${user?.lastName}`}{" "}
          -{" "}
          <span className="text-[9px]">
            {formatDateDetailed(comment.createdAt)}
            {/* {comment.createdAt} */}
          </span>
        </p>
        <p className="text-xs  break-all px-1">{comment.text}</p>
      </div>
      {isSelected && authUser._id === user._id && (
        <div className="absolute w-auto p-1 flex justify-center right-2 text-[10px] container rounded-xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteComment.mutate(comment._id);
            }}
          >
            Delete
          </button>
        </div>
      )}
     { authUser._id !== user._id && !liked &&    <MdFavoriteBorder className={`size-4 hover:text-violet-500  cursor-pointer ${liked && "text-violet-500"}`}  onClick={()=>{ likeComment.mutate(comment._id); setLiked(true);}}/>}
     { authUser._id !== user._id && liked && <MdFavorite className={`size-4 hover:text-gray-500  cursor-pointer text-violet-500`}  onClick={()=>{ removeLikeComment.mutate(comment._id); setLiked(false);}}/>}
    </div>
  );
};

export default Comment;
