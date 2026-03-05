import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { PiStudentBold, PiStudentFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
const SignUpPage = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [accountType, setAccountType] = useState("normal");
  const { signUp, isLoading, error } = useAuthStore();
  const onSubmit = async (data) => {
    let formData;
    formData = {
      firstName: data["first-name"] || "",
      lastName: data["last-name"] || "",
      name: data["name"] || "",
      major: data["major"] || "",
      email: data.email,
      password: data.password,
      accountType: accountType,
    };
    try {
      await signUp(formData);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(accountType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleGoogleLogin = () => {
    // Redirect la backend OAuth endpoint
    window.location.href = "http://localhost:5000/api/auth/google";
  };
  return (
    <>
      <div className="flex min-h-full flex-col p-6 lg:px-8 w-screen overflow-hidden">
        <div className="relative z-10 w-full">
          <div id="stars" />
          <div id="stars2" />
          <div id="stars3" />
        </div>
        <div className="sm:mx-auto md:w-1/3  flex justify-center p-2 z-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="container w-full  rounded-2xl shadow p-10"
          >
            <h2 className="text-5xl font-black text-center heading-text-1 rounded-t-2xl pb-10">
              Sign Up
            </h2>
            <div className="w-full flex mb-4">
              <div
                className={`w-full flex justify-center p-0.5 text-[10px] border-gray-500 rounded-sm cursor-pointer ${accountType === "normal" && "border"}`}
                onClick={() => setAccountType("normal")}
              >
                Normal Account
              </div>
              <div
                className={`w-full flex justify-center p-0.5 text-[10px] cursor-pointer border-gray-500 rounded-sm ${
                  accountType === "business" && "border"
                }`}
                onClick={() => setAccountType("business")}
              >
                Business Account
              </div>
            </div>
            {error && (
              <div className="bg-red-300 p-2 rounded-xl">
                <p className=" text-xs text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium my-2 "
              >
                University Email Address
              </label>
              {errors.email && <p className="error">{errors.email.message}</p>}
              <div className="relative w-full">
                <MdEmail className="absolute top-3 left-2 " />
                <input
                  id="email"
                  {...register("email", {
                    required: "An university email is required",
                    type: "email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  autoComplete="email"
                  placeholder="Email"
                  className="block w-full rounded-md px-8 py-2 text-base text-gray-90 outline-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium my-2"
              >
                {accountType === "normal" ? "First Name" : "Name"}
              </label>
              {errors["first-name"] && (
                <p className="error">{errors["first-name"].message}</p>
              )}
              <div className="relative w-full">
                <FaUser className="absolute top-3 left-2 " />
                <input
                  id={accountType === "normal" ? "first-name" : "name"}
                  {...register(
                    `${accountType === "normal" ? "first-name" : "name"}`,
                    {
                      required:
                        accountType === "normal"
                          ? "Enter your first name"
                          : "Enter your company name",
                    },
                  )}
                  autoComplete={
                    accountType === "normal" ? "First Name" : "Name"
                  }
                  placeholder={accountType === "normal" ? "First Name" : "Name"}
                  className=" w-full rounded-md px-8 py-1.5 text-base  outline-1 -outline-offset-1 outline-violet-700    placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            {accountType === "normal" && (
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium my-2 "
                >
                  Last Name
                </label>
                {errors["last-name"] && (
                  <p className="error">{errors["last-name"].message}</p>
                )}
                <div className="relative w-full">
                  <FaUser className="absolute top-3 left-2 " />
                  <input
                    id="last-name"
                    {...register("last-name", {
                      required: "Enter your last name",
                    })}
                    autoComplete="Last Name"
                    placeholder="Last Name"
                    className="w-full rounded-md px-8 py-1.5 text-base  outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {/* <label
                    htmlFor="major"
                    className=" block text-sm font-medium my-2"
                  >
                    Major
                  </label>
                  <div className="relative w-full">
                    <PiStudentFill className="absolute top-3 left-2 " />
                    <input
                      id="major"
                      {...register("major")}
                      placeholder="Major"
                      className="w-full rounded-md px-8 py-2 text-base  outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div> */}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium my-2"
                >
                  Password
                </label>
              </div>
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
              <div>
                <div className="flex relative w-full">
                  <FaLock className="absolute top-3 left-2 " />
                  <input
                    id="password"
                    {...register("password", {
                      required: "The password is required",
                      minLength: {
                        value: 8,
                        message:
                          "The passwords needs to be at least 8 characters",
                      },
                      validate: (value) => {
                        if (value.length < 8)
                          return "The password needs to be at least 8 characters long";
                        return true;
                      },
                    })}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="w-full rounded-md px-8 py-1.5 text-base  outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {(!showPassword && (
                    <FaEye
                      className="absolute top-3 right-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )) || (
                    <FaEyeSlash
                      className="absolute top-3 right-3 "
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium my-2"
              >
                Confirm Password
              </label>
              <div>
                {errors["confirm-password"] && (
                  <p className="error">{errors["confirm-password"].message}</p>
                )}
                <div className="flex relative w-full">
                  <FaLock className="absolute top-3 left-2" />
                  <input
                    id="confirm-password"
                    {...register("confirm-password", {
                      required: "Please confirm your password",
                      //  minLength:{
                      //   value:8,
                      //   message:"Password at least 8 characters"
                      //  },
                      validate: (value) => {
                        if (
                          value !== document.getElementById("password").value
                        ) {
                          return "Passwords do not match";
                        }
                        return true;
                      },
                    })}
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="Confirm password"
                    className="block w-full rounded-md px-8 py-1.5 text-base  outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {(!showConfirmPassword && (
                    <FaEye
                      className="absolute top-3 right-3 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  )) || (
                    <FaEyeSlash
                      className="absolute top-3 right-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            {/* {eroare && <p className="text-red-400 px-10">{eroare}</p>} */}
            <div className="flex justify-center my-5">
              <button
                type="submit"
                className="outline-0 w-1/2 flex justify-center rounded-md bg-violet-700 p-2 px-4 text-sm/6 font-semibold text-white shadow-xs hover:bg-violet-500  hover:scale-110 btn-violet"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
            <h1 className="text-center my-5 opacity-70"> Or </h1>
            <div
              className="w-full flex justify-center items-center border p-2 rounded-xl border-violet-900 hover:scale-105 cursor-pointer"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="inline-block mr-2 size-6" /> Continue with
              Google
            </div>
            <div className="flex flex-col w-full rounded-b-2xl p-2 justify-center items-center text-sm ">
              <p className="text-xs">
                Already have an account? -{" "}
                <Link to={"/login"} className="hover:underline text-sm">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
