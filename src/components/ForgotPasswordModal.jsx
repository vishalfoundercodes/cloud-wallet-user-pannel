import React, { useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import CloudImage from "../assets/logo.png";
import apis from "../utils/apis";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [secretKey, setSecretKey] = useState(new Array(9).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return toast.error("Enter email first!");
    setLoading(true);
    try {
      const res = await axios.post(apis?.forget_password, { email });
      toast.success(res.data.message || "OTP sent to your email 📧");
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong! ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newKey = [...secretKey];
    newKey[index] = value.toUpperCase();
    setSecretKey(newKey);
    setOtp(newKey.join(""));

    if (value && index < 8) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().toUpperCase();
    if (!pasteData) return;
    const chars = pasteData.split("").slice(0, 9);
    setSecretKey(chars.concat(new Array(9 - chars.length).fill("")));
    setOtp(chars.join(""));

    chars.forEach((ch, i) => {
      const input = document.getElementById(`otp-${i}`);
      if (input) input.value = ch;
    });

    const lastInput = document.getElementById(`otp-${chars.length - 1}`);
    if (lastInput) lastInput.focus();
  };

  const handleVerifyOTP = async () => {
    const otpValue = secretKey.join("");
    if (!otpValue || otpValue.length < 9) {
      return toast.error("Please enter complete 9-character OTP ❌");
    }
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all fields!");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.post(apis?.verify_forget_password,
        { email, otp: otpValue, new_password: newPassword }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        onClose();
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message|| "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-richblack-800 rounded-xl p-6 w-80 xl:w-96 shadow-lg">
        {/* 🔹 Cloud Image */}
        <div className="flex justify-center">
          <img src={CloudImage} alt="Cloud Wallet" className="w-20 h-20 object-contain" />
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center dark:text-white">
          Forgot Password
        </h2>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-richblack-700 bg-gray-100 dark:bg-richblack-700 dark:text-richblack-25 outline-none text-sm"
            />
            <button
              onClick={handleSendOTP}
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium dark:bg-gradient-to-b from-[#7AFEC3] to-[#02AFB6] dark:hover:text-richblack-800 dark:text-richblack-900 cursor-pointer"
            >
              {loading ? <Spinner /> : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* 🔹 OTP Input Boxes */}
            <label className="text-gray-700 dark:text-white text-sm font-medium mb-1 block text-center">
              Enter OTP
            </label>
            <div className="grid grid-cols-9 gap-1 mb-3">
              {secretKey.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type={showOtp ? "text" : "password"}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !secretKey[index] && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      if (prevInput) prevInput.focus();
                    }
                  }}
                  onPaste={handleOtpPaste}
                  className="w-full h-12 text-center text-lg font-bold border-2 border-gray-500 rounded-lg focus:border-blue-500 dark:focus:border-[#7AFEC3] focus:outline-none transition-colors
                    dark:text-richblack-25 dark:bg-richblack-700 bg-white"
                  maxLength={1}
                  inputMode="text"
                />
              ))}
            </div>
            <div className="flex justify-center mb-3">
              <button
                onClick={() => setShowOtp(!showOtp)}
                className="text-gray-500 text-sm hover:text-gray-700 dark:text-richblack-200 dark:hover:text-richblack-100 cursor-pointer"
              >
                {showOtp ? <><EyeOff className="inline w-4 h-4 mr-1" />Hide</> : <><Eye className="inline w-4 h-4 mr-1" />Show</>}
              </button>
            </div>

            {/* 🔹 New Password */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-richblack-700 bg-gray-100 dark:bg-richblack-700 dark:text-richblack-25 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* 🔹 Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-richblack-700 bg-gray-100 dark:bg-richblack-700 dark:text-richblack-25 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* 🔹 Verify Button */}
            <button
              onClick={handleVerifyOTP}
              className="w-full py-2 bg-green-500 dark:bg-gradient-to-b from-[#7AFEC3] to-[#02AFB6] text-richblack-900 rounded-lg font-medium cursor-pointer"
            >
              {loading ? <Spinner /> : "Verify & Reset Password"}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full py-2 text-center text-[16px] font-semibold hover:text-red-600 text-red-500 cursor-pointer border dark:border-gray-400 hover:border-gray-500 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
