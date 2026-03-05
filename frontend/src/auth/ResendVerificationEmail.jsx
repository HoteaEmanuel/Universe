import React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const ResendVerificationEmail = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { sendVerificationEmail, isLoading, error } = useAuthStore();

  const onSubmit = async (data) => {
    try {
      await sendVerificationEmail(data.email);
      toast.success("Verification email sent! Check your inbox.", {
        duration: 5000,
      });
      navigate("/verify-email");
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
        <h1 className="text-3xl">Verify your account</h1>
        <hr className="text-gray-300"></hr>
        {error && <p className="text-red-500">{error}</p>}
        <label htmlFor="email" className="text-lg">
          Enter your email{" "}
        </label>
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email address",
            },
          })}
          className="text-xl p-2 border-2 border-neutral-400 rounded-xl"
          id="email"
        />
        <button className="bg-violet-800 p-2 rounded-2xl hover:scale-105 text-white">
          {isLoading ? "Loading..." : "Send Verification Email"}
        </button>
        {error && error === "This user is already verified" && (
          <Link to="/login">Log in instead</Link>
        )}
      </form>
    </div>
  );
};

export default ResendVerificationEmail;
