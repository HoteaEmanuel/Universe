import React from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="wrapper gap-5 p-10">
      <div className="w-full h-full flex items-center justify-center gap-10">
        {" "}
        <img src="/images/error.png" alt="alert" className="size-70" />
        <div className="flex flex-col gap-10 justify-center">
          <h1 className="text-5xl font-bold font-sans">Page Not Found</h1>
          <h1 className="text-2xl">
            You navigated too far :) - this page doesn't exist
          </h1>
        </div>
      </div>
      <a
        href="/"
        className="px-5 py-3 bg-violet-900 rounded-xl cursor-pointer hover:scale-105 transition duration-300"
      >
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
