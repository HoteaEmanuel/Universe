import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
const ResetPassword = () => {
  const { resetPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { token } = useParams();
  const onSubmit = async (password) => {
    try {
      const response = await resetPassword(token, password.password);
      if (response instanceof Error) {
        throw response;
      }
      navigate("/login");
    } catch (error) {
      return new Error(error);
    }
  };
  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 container shadow-2xl rounded-2xl p-20 gap-4 text-xl flex flex-col"
      >
        <label htmlFor="new-password" className="text-3xl font-semibold mb-5 ">
          Enter the new password
        </label>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <div className="relative">
          <input
            {...register("password", {
              required: "The password is required",
              minLength: {
                value: 8,
                message: "Enter a minimum 8 characters password",
              },
            })}
            id="new-password"
            type={showPassword ? "text" : "password"}
            className="w-full border border-gray-500 rounded-md pl-2 pr-10 py-2 font-semibold"
          ></input>
          {showPassword ? (
            <FaEyeSlash
              className="absolute top-3 right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaEye
              className="absolute top-3 right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <button className="bg-violet-600 p-2 rounded-2xl hover:scale-105">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
