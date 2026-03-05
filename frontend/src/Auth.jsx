import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./auth/SignUpPage";
import LoginPage from "./auth/LoginPage";
import VerifyEmail from "./auth/VerifyEmail";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Header from "./components/Header";
const Auth = () => {
  return (
    <>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </>
  );
};

export default Auth;
