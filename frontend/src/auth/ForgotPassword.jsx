import React from "react";
import Header from "../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { forgotPassword } = useAuthStore();
  const onSubmit = async (data) => {
    try {
      console.log(data.email);
      await forgotPassword(data.email);
      toast.success("Password reset email sent! Check your inbox.", {
        duration: 5000,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container flex flex-col w-1/4 p-6 gap-4 shadow rounded-xl"
      >
        <h1 className="text-3xl">Reset your password</h1>
        <hr className="text-gray-300"></hr>
        <label htmlFor="email" className="text-lg">
          Enter your email{" "}
        </label>
        {errors.email && <p>{errors.email}</p>}
        <input
          {...register("email", {
            required: true,
            validate: (value) => {
              /^\S+@\S+\.\S+$/.test(value) || "Enter a valid email address";
            },
          })}
          className="text-xl p-2 border-2 border-neutral-400 rounded-xl"
          id="email"
          type="email"
        ></input>
        <button className="bg-violet-600 text-gray-200 p-2 rounded-2xl hover:scale-105">
          Change password!
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
