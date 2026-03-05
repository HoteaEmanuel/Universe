import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { FaComments, FaUserCircle } from "react-icons/fa";
import { MdChatBubble, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { LuBookmarkPlus } from "react-icons/lu";
import { GoBookmarkSlashFill } from "react-icons/go";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  useGetLikesQuery,
  usePostLikedQuery,
  usePostUserQuery,
} from "../queryAndMutation/queries/post-queries";
import { useIsFollowingQuery } from "../queryAndMutation/queries/user-queries";
import {
  useFollowMutation,
  useSavePostMutation,
  useUnfollowMutation,
  useUnsavePostMutation,
} from "../queryAndMutation/mutations/user-mutation";
import { useGetPostCommentsCount } from "../queryAndMutation/queries/comments-queries";
import {
  useLikeMutation,
  useUnlikeMutation,
} from "../queryAndMutation/mutations/post-mutation";
import { formatDateDetailed } from "../utils/formatDate";
import LikesModal from "../Modals/LikesModal";
import { urlPathName } from "../utils/urlPathFromName";
import ImageSlider from "./ImageSlider";
const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { userId } = post;
  const postId = post._id;
  const [showMore, setShowMore] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const bodyRef = useRef(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  useEffect(() => {
    const body = bodyRef.current;
    if (body) {
      if (body.scrollHeight > body.clientHeight) {
        setIsClamped(true);
      }
    }
  }, []);

  const { data: creator, isPending: isPendingPostUser } = usePostUserQuery(
    userId,
    postId,
  );

  const { data: liked, isPending: isPendingCheckLiked } =
    usePostLikedQuery(postId);

  const { data: isFollowing, isPending: isPendingIsFollowing } =
    useIsFollowingQuery(userId);
  const { data: likes, isPending: isPendingLikes } = useGetLikesQuery(postId);
  const { data: commentsCount, isPending: isPendingCommentsCount } =
    useGetPostCommentsCount(postId);
  const likeMutation = useLikeMutation(postId);
  const unlikeMutation = useUnlikeMutation(postId);
  const { mutate: savePostMutation } = useSavePostMutation(postId, user._id);
  const followMutation = useFollowMutation(userId, user._id);
  const unfollowMutation = useUnfollowMutation(userId, user._id);
  const { mutate: unsavePostMutation } = useUnsavePostMutation(
    postId,
    user._id,
  );

  const [showSaveOption, setShowSaveOption] = useState(false);
  const postTime = formatDateDetailed(post.createdAt.toString());
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const prevLikes =
      queryClient.getQueryData(["likes", postId]) ?? post.likes.length;
    const prevLiked =
      queryClient.getQueryData(["userLiked", postId]) ?? !!liked;

    queryClient.setQueryData(
      ["likes", postId],
      (old) =>
        (typeof old === "number" ? old : prevLikes) + (prevLiked ? -1 : 1),
    );
    queryClient.setQueryData(["userLiked", postId], !prevLiked);

    try {
      if (!prevLiked) {
        likeMutation.mutate();
      } else {
        unlikeMutation.mutate();
      }
    } catch (err) {
      queryClient.setQueryData(["likes", postId], prevLikes);
      queryClient.setQueryData(["userLiked", postId], prevLiked);
    }
  };
  const fullName = urlPathName(creator);
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId !== user._id) {
      navigate(`/users/${fullName}`);
    } else {
      navigate("/profile");
    }
  };

  const handleFollowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    followMutation.mutate(userId);
  };

  const handleUnfollowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    unfollowMutation.mutate(userId);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    savePostMutation(undefined, {
      onSuccess: () => {
        console.log("SAVED WAS SUCCESSFUL");
        setIsSaved(true);
      },
      onError: (error) => {
        console.error("Save failed:", error);
      },
    });
  };

  const handleSeeMoreClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMore(!showMore);
  };
  const handleSeeRelated = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/related-posts/${tag}`);
  };
  const handleSeeLikesModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLikesModal(true);
  };
  const handleUnSavePostClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    unsavePostMutation(undefined, {
      onSuccess: () => {
        console.log("UNSAVED WAS SUCCESSFUL");
        setIsSaved(false);
      },
    });
  };
  if (
    isPendingCheckLiked ||
    isPendingIsFollowing ||
    isPendingPostUser ||
    isPendingLikes ||
    isPendingCommentsCount
  )
    return <p>Loading...</p>;
  console.log("POSTARE: ", post);
  const { firstName, name, lastName, profilePicture } = creator;
  return (
    <Link
      to={`/post/${postId}`}
      className="w-full h-full flex flex-col justify-center md:p-5 rounded-2xl"
    >
      {post.imagesUrls?.length === 1 && (
        <img
          src={post.imagesUrls[0]}
          alt="post image"
          className="w-full h-100 rounded-2xl rounded-b-none self-center object-cover border border-gray-700"
        />
      )}
      {post.imagesUrls?.length > 1 && <ImageSlider images={post.imagesUrls} />}
      <div
        className={`rounded-xl ${post?.imagesUrls?.length > 0 && "rounded-t-none"} p-5 shadow postCard`}
      >
        <div className="flex items-center gap-2 py-5">
          {(profilePicture && (
            <img
              src={profilePicture}
              alt="profile picture"
              className="size-10 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            />
          )) || (
            <FaUserCircle
              className="w-10 h-10 main-dark cursor-pointer"
              onClick={handleProfileClick}
            />
          )}
          <div className="w-full flex justify-between">
            <div>
              <p className="text-lg">
                {firstName || name} {lastName}
              </p>

              <p className="text-gray-500 text-xs">
                {postTime}
                {post?.location && " - " + post.location}
              </p>
            </div>

            {(!isFollowing && userId !== user._id && (
              <button
                className=" p-1 px-2 rounded-2xl hover:scale-105 transition-transform duration-200 ease-in"
                onClick={handleFollowClick}
              >
                <span className="gradient-text-light text-sm">Follow</span>
              </button>
            )) ||
              (userId !== user._id && isFollowing && (
                <button
                  className="p-0.5 rounded-2xl hover:scale-105 transition-transform duration-200 ease-in"
                  onClick={handleUnfollowClick}
                >
                  <span className="gradient-text-light text-[10px]">
                    Unfollow
                  </span>
                </button>
              ))}
          </div>
        </div>
        <div className="relative w-full">
          {userId !== user._id && !post.isSaved && !isSaved && (
            <LuBookmarkPlus
              className="absolute right-2 top-2 size-5 main-dark hover:scale-110 cursor-pointer violet"
              onClick={handleSaveClick}
              onMouseEnter={() => setShowSaveOption("Save post")}
              onMouseLeave={() => setShowSaveOption(false)}
            />
          )}
          {showSaveOption === "Save post" && (
            <span className="text-[10px] absolute right-2 top-8 bg-gray-700 text-white p-1 rounded-md">
              {showSaveOption}
            </span>
          )}
        </div>

        <hr className="text-gray-400 p-2"></hr>
        <div className="flex w-full flex-col">
          <h1 className="font-semibold text-lg">{post?.title}</h1>
          {post?.body && (
            <h1
              className={`text-sm w-9/10 wrap-break-word ${!showMore && "line-clamp-3"}`}
              ref={bodyRef}
            >
              {post.body}
            </h1>
          )}
        </div>
        <div className="relative w-full flex items-center gap-2 py-2 mb-5">
          {userId !== user._id && post.isSaved && isSaved && (
            <GoBookmarkSlashFill
              className="absolute top-2 right-2 w-10 h-6 violet hover:scale-110 cursor-pointer fill-violet-300"
              onClick={handleUnSavePostClick}
              onMouseEnter={() => setShowSaveOption("Unsave post")}
              onMouseLeave={() => setShowSaveOption(false)}
            />
          )}
          {showSaveOption === "Unsave post" && (
            <span className="text-[10px] absolute right-2 top-8 bg-gray-700 text-white p-1 rounded-md">
              {showSaveOption}
            </span>
          )}
        </div>
        {isClamped && (
          <button
            className="py-2 text-[10px] hover:scale-105 italic"
            onClick={handleSeeMoreClick}
          >
            {showMore ? "See less" : "See more"}
          </button>
        )}

        <div className="w-full flex items-center gap-2 py-2 mb-5">
          <div className="flex">
            {" "}
            <button className="hover:scale-110" onClick={(e) => handleLike(e)}>
              {(liked && (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <defs>
                    <linearGradient
                      id="heartGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#2f0d68" />
                    </linearGradient>
                    <filter
                      id="heartShadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="1"
                        stdDeviation="1.5"
                        floodColor="#7008e7"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>
                  <path
                    fill="url(#heartGradient)"
                    filter="url(#heartShadow)"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
       4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76
       3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55
       11.54L12 21.35z"
                  />
                </svg>
              )) || (
                <MdFavoriteBorder className="size-6 text-violet-500 hover:text-violet-700" />
              )}
            </button>
            <span
              className="text-lg font-bold font-serif -mt-0.5 cursor-pointer mx-1"
              onClick={handleSeeLikesModal}
            >
              {likes}
            </span>
          </div>
          {showLikesModal && likes > 0 && (
            <LikesModal
              open={showLikesModal}
              onClose={() => setShowLikesModal(false)}
              postId={postId}
            />
          )}
          <div className="flex gap-1">
            <button>
              <FaComments className="size-6 violet" />
            </button>

            <span className="text-lg font-bold font-serif cursor-pointer mx-1">
              {commentsCount}
            </span>
          </div>
        </div>
        <ul className="flex gap-2">
          {post.tags?.map((tag) => (
            <li
              key={tag + userId}
              className="text-xs text-gray-500 contrastBg p-1 rounded-2xl hover:text-white cursor-pointer"
              onClick={(e) => handleSeeRelated(e, tag)}
            >
              #{tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

export default PostCard;
