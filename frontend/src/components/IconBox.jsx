import React from "react";
import { Link } from "react-router-dom";
const IconBox = ({ children, to }) => {
  return (
    <Link className="w-full flex flex-col justify-center items-center rounded-xl p-2 mx-5 hover:bg-violet-200 cursor-pointer" to={to}>
      <div className="w-1/2 p-2 flex gap-2 items-center">{children}</div>
    </Link>
  );
};

export default IconBox;
