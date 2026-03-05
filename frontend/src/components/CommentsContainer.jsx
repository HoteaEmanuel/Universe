import React from "react";
import { useState } from "react";
import { useGetPostComments } from "../queryAndMutation/queries/comments-queries";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
const CommentsContainer = () => {
  const { id: postId } = useParams();
  const { data: comments, isPending: isPendingComments } =
    useGetPostComments(postId);

  console.log("ALL THE COMMENTS : ", comments);
  const [showComments, setShowComments] = useState(true);
  if (isPendingComments) return <p>Loading...</p>;
  return (
    <section>
      <button onClick={() => setShowComments((prev) => !prev)}>Comments</button>
      <hr className="py-2 text-gray-400"></hr>
      {comments === 0 ? (
        <p className="text-xs">No comments yet - maybe send one?</p>
      ) : showComments && comments.length ? (
        <ul className="flex flex-col gap-4  py-2 ">
          {comments.map((comment) => (
            <li key={comment._id} className="hoverGray hover:bg-red-500">
              <Comment comment={comment} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
      <CommentInput />
    </section>
  );
};

export default CommentsContainer;
