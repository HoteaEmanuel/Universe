import React from "react";

const PostSkelet = () => {
  return (
    <div className="flex flex-col w-full h-full animate-pulse rounded-xl p-4 gap-4 bgGray glass-effect">
      <div className="container w-full h-32 animate-pulse rounded-md"></div>
      <div className="flex flex-col gap-2">
        <div className="container w-full h-4 animate-pulse rounded-md"></div>
        <div className="container w-4/5 h-4 animate-pulse rounded-md"></div>
        <div className="container w-full h-4 animate-pulse rounded-md"></div>
        <div className="container w-2/4 h-4 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};

export default PostSkelet;
