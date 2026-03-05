import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_1.png";
import group_image from "../assets/alta_imagine.png";
import "../stars.css";
const LandingPage = () => {
  return (
    <div className=" w-full h-full max-h-screen overflow-hidden">
      <img src={logo} className="w-30 h-30 self-end" />
      <div className="relative">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>

      <div className="flex h-screen items-center justify-center gap-10 -mt-10">
        <div className="w-0 md:w-3/4 flex flex-col justify-center items-center mr-4 -mt-20">
          <img src={group_image} className="hidden md:block w-screen" />
        </div>

        <div className=" flex flex-col justify-center items-center gap-5 h-screen w-full">
          <h1 className="text-8xl kaushan font-semibold heading-text-1  -translate-y-10">
            Universe'
          </h1>
          <div className="flex flex-col gap-10 items-center">
            <h1 className="text-2xl md:text-5xl heading-text-1  italic font-semibold ">
              Find Your Campus Community
            </h1>
            <h1 className="text-2xl heading-text-1 md:text-4xl italic p-2 font-semibold">
              Never Miss a Uni Event
            </h1>
            <h1 className="text-3xl heading-text-1 italic font-semibold">Share experiences</h1>
          </div>

          <Link
            to={"/signup"}
            className="text-lg cursor-pointer font-bold shadow hover:from-violet-50 hover:to-violet-200 hover:text-black text-amber-50 border-violet-950 border-2 bg-linear-to-r from-violet-700 to-violet-900 p-4 rounded-2xl  hover:translate-y-1 duration-300 ease-in"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
