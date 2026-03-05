import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from "sonner";
import "../stars.css";
const LoginPage = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);
  const url = useLocation();
  const { logIn, error, isLoading, isVerified, clearError, isAuthenticated } =
    useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);
  useEffect(() => {
    if (isAuthenticated && !error) return navigate("/home");
  }, [error, navigate, isAuthenticated]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    await logIn(data.email, data.password);
  };
  const [googleError, setGoogleError] = useState(null);
  useEffect(() => {
    if (url.search === "?error=google_auth_failed") {
      setGoogleError({
        message:
          "Google authentication failed. Provide a university email or try again.",
      });
    }
  }, [url.search]);
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000/api"}/auth/google`;
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex h-[90vh] flex-col justify-center items-center px-6 py-12 lg:px-8 w-screen overflow-hidden">
      {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm"></div> */}
      <div className="relative z-10 w-full">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
      </div>
      <div className=" sm:w-2/3  max-w-md rounded-4xl z-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
          className="container flex flex-col w-full gap-5 h-full rounded-4xl shadow p-5"
        >
          {/* {googleError &&
            toast.error(googleError.message, {
              duration: 5000,
              position: "top-right",
            })} */}

          <h2 className="text-5xl font-black p-4 text-center heading-text-1">
            Log in
          </h2>
          {error && (
            <div className="rounded-xl bg-red-300">
              <p className="text-xs text-red-700 p-2">{error}</p>
            </div>
          )}
          {googleError && (
            <div className="mx-10 p-2 rounded-xl bg-red-300">
              <p className="text-xs text-red-700">{googleError.message}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium py-1">
              Email
            </label>
            {errors.email && <p className="error">{errors.email.message}</p>}
            <div className="relative">
              <MdEmail className="absolute top-3 left-2" />
              <input
                id="email"
                {...register("email", {
                  required: "An university email is required",
                  type: "email",
                  validate: (value) => {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return "Email must be a valid email address";
                    }
                    return true;
                  },
                })}
                placeholder="University Email"
                autoComplete="email"
                className=" w-full rounded-md px-8 py-2 text-base outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium py-1"
            >
              Password
            </label>
            {errors.password && (
              <p className="error p-2">{errors.password.message}</p>
            )}
            <div className="flex relative">
              <FaLock className="absolute top-3 left-2 text-sm" />
              <input
                id="password"
                {...register("password", {
                  required: "The password is required",
                  minLength: {
                    value: 8,
                    message: "The passwords needs to be at least 8 characters",
                  },
                  validate: (value) => {
                    if (value.length < 8)
                      return "The password needs to be at least 8 characters long";
                    return true;
                  },
                })}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                className="w-full rounded-md px-8 py-2 text-base outline-1 -outline-offset-1 outline-violet-700 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />

              {(!showPassword && (
                <FaEye
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )) || (
                <FaEyeSlash
                  className="absolute top-3 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="flex w-full justify-center  rounded-md  mb-1 py-2 font-semibold text-white shadow-xs hover:bg-violet-500  hover:scale-105 focus-visible:outline-indigo-600 btn-violet"
            >
              {(!isLoading && <span className="loader">Log in</span>) || (
                <span>Loading...</span>
              )}
            </button>
          </div>
          <h1 className="text-center my-2 opacity-70"> Or </h1>
          <div
            className="w-full flex justify-center items-center border p-2 rounded-xl border-violet-900 hover:scale-105 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="inline-block mr-2 size-6" /> Continue with
            Google{" "}
          </div>
          <div className="flex items-center justify-between">
            <Link
              to={"/forgot-password"}
              className="text-[10px] hover:underline  hover:font-semibold px-10 cursor-pointer opacity-80"
            >
              Forgot your password?
            </Link>
            <hr className=""></hr>
            {!isVerified && (
              <Link
                to="/resend-verify-email"
                className="text-[10px] hover:underline hover:font-semibold px-10 cursor-pointer opacity-80"
              >
                Verify account
              </Link>
            )}
          </div>

          <div className="flex text-xs  rounded-b-2xl items-center justify-center gap-2 p-2 mt-4 w-full">
            <p>Don't have an account?</p>
            <Link
              to={"/signup"}
              className="text-sm font-semibold text-blue-800 hover:underline"
            >
              Create one!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
