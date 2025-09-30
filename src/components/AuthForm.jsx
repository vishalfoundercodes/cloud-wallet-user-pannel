import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import apis from "../utils/apis";
import Spinner from "./Spinner";
import CloudLogo from "../assets/logo.png";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log("api", apis.login);
    try {
      const loginPayload = {
        email: formData.email,
        password: formData.password,
      };

      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (isSignIn) {
        // 🔹 Login API call
        console.log("Login Payload Response", loginPayload);
        const res = await axios.post(apis?.login, loginPayload);
        console.log("Login API Response", res);

        if (res.data.message?.includes("OTP")) {
          toast.success("OTP sent to your email 📧");
          // setShowOtpModal(true); // ✅ open modal
          navigate("/verify-otp", {
            state: { email: formData.email, password: formData.password },
          });
        } else {
          toast.error(res.data.message || "Login failed ❌");
        }
      } else {
        // 🔹 Register API call
        const res = await axios.post(apis.register, registerPayload);
        // console.log("Register API call Response", res);

        if (res.data.success) {
          toast.success(res.data.message || "Registered successfully 🎉");
          setIsSignIn(true);
          navigate("/");
        } else {
          toast.error(res.data.message || "Registration failed ❌");
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again!"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Auth Form */}
      <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-richblack-800 px-4">
        <div className="w-full max-w-md bg-white dark:bg-richblack-900 shadow-lg rounded-2xl p-8">
          {/* Logo & Title */}
          <div className="flex justify-center mb-3">
            <img src={CloudLogo} alt="" className="w-[8rem] h-[6rem]" />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold dark:text-richblack-25">
              CloudWallet
            </h1>
            <i className="text-gray-500 dark:text-richblack-300">
              World's Safest,{" "}
              <span className="text-[#47A5C5]">
                Truly Untraceable Cloud Wallet.
              </span>
            </i>
          </div>

          {/* Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-richblack-800 rounded-full p-1">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                isSignIn
                  ? "bg-white dark:bg-richblack-900 shadow text-black dark:text-richblack-50"
                  : "text-gray-500 dark:text-richblack-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                !isSignIn
                  ? "bg-white dark:bg-richblack-900 shadow text-black dark:text-richblack-50"
                  : "text-gray-500 dark:text-richblack-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div>
                <label className="block text-sm font-medium dark:text-richblack-5">
                  Full Name <sub className="text-pink-200">*</sub>
                </label>
                <div className="flex items-center mt-1 bg-gray-100 dark:bg-richblack-800 rounded-lg px-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none px-2 py-3 text-sm dark:text-richblack-5"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium dark:text-richblack-5">
                Email <sup className="text-pink-200">*</sup>
              </label>
              <div className="flex items-center mt-1 bg-gray-100 dark:bg-richblack-800 rounded-lg px-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none px-2 py-3 text-sm dark:text-richblack-5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-richblack-5">
                Password <sup className="text-pink-200">*</sup>
              </label>
              <div className="relative flex items-center mt-1 bg-gray-100 dark:bg-richblack-800 rounded-lg px-3">
                <Lock className="h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  placeholder={
                    isSignIn ? "Enter password" : "Create a password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none px-2 py-3 text-sm dark:text-richblack-5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* 🔹 Forgot Password link */}
              {isSignIn && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm text-blue-500 dark:text-pink-400 hover:underline italic cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 dark:bg-yellow-50 text-white dark:text-richblack-900 rounded-lg font-medium mt-2 cursor-pointer"
            >
              {loading ? <Spinner /> : isSignIn ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      {/* 🔹 Forgot Password Modal */}
    <ForgotPasswordModal
      isOpen={showForgotModal}
      onClose={() => setShowForgotModal(false)}
    />

    </>
  );
}
