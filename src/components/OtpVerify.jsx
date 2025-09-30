import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, Lock, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import apis from "../utils/apis";
import axios from "axios";
import Loader from "../reusable_component/Loader";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [secretKey, setSecretKey] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(120); // 2 min = 120 seconds

  const navigate = useNavigate();
  const location = useLocation();

  // email aaya h login se
  const email = location.state?.email || localStorage.getItem("user_email");
  const password =
    location.state?.password || localStorage.getItem("user_password");

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  // Handle input change for secret key boxes
  const handleInputChange = (index, value) => {
    // Only allow single digit or empty
    if (value.length > 1) {
      value = value.slice(-1); // Take only last character
    }

    const newKey = [...secretKey];
    newKey[index] = value;
    setSecretKey(newKey);

    // Update OTP string
    setOtp(newKey.join(""));

    // Auto focus next input
    if (value && index < 8) {
      setTimeout(() => {
        const nextInput = document.getElementById(`key-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = secretKey.join("").toUpperCase();;
    if (!otpValue || otpValue.length < 9) {
      toast.error("Please enter complete 9-digit OTP ❌");
      return;
    }

    setLoading(true);
    try {
      const otpPayload = {
        email: email,
        otp: otpValue,
      };
  // console.log("OTP verification Payload", otpPayload);
      const res = await axios.post(apis?.verify_otp, otpPayload);
      // console.log("VERIFY RESPONSE", res);
      // console.log("OTP verification Payload", otpPayload);

      // yaha res.data use karna hai
      if (res.data.success) {
        console.log("OTP verified ✅", res.data);
        localStorage.setItem("user_id", res.data.user?.id);
        localStorage.setItem("user_email", res.data.user?.email);
        localStorage.setItem("user_name", res.data.user?.name);
        localStorage.setItem("auth_token", res.data.token);

        toast.success(res.data.message || "Login successful 🎉");
        navigate("/wallet");
      } else {
        toast.error(res.data.message || "Invalid OTP ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message||"Something went wrong ❌");
      console.error("Error:", err.response?.data || err.message);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  // Resend OTP with 2 min disable
  const handleResendOtp = async () => {
  if (!email) {
    toast.error("Email missing ❌");
    return;
  }

  setLoading(true); // ✅ Loader start

  const payload = password ? { email, password } : { email };

  try {
    const res = await axios.post(apis?.login, payload);
    console.log("Resend OTP response:", res.data);
    console.log("Resend OTP payload:", payload);

    if (res.data.message?.includes("OTP")) {
      toast.info("OTP sent again to " + email + " 📱");
      setResendDisabled(true); // Disable button
      setTimer(120); // Start 2 min countdown
    } else {
      toast.error("Failed to resend OTP ❌");
    }
  } catch (err) {
    toast.error("Failed to resend OTP ❌");
    console.error(err.response?.data || err.message);
  } finally {
    setLoading(false); // ✅ Loader stop
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-richblack-800 flex justify-center dark:bg-none p-4">
      <div className="bg-white dark:bg-richblack-900 rounded-3xl shadow-2xl w-full max-w-[24rem] p-8">
        {/* Logo and Icon */}
        <div className="flex justify-center mb-4 relative">
          <div className="bg-blue-500 rounded-2xl p-4 relative">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 dark:text-richblack-25 mb-2">
            Welcome to Cloud Wallet World
          </h1>
          <p className="text-gray-500 dark:text-[#47A5C5] text-sm">
            the most secure and anonymous wallet.
          </p>
        </div>

        {/* Secret Key Input */}
        <div className="mb-6">
          <label className="block text-gray-600 dark:text-richblack-50 text-center mb-4 font-medium">
            Enter your secret key
          </label>

          <div className="grid grid-cols-9 gap-1 mb-4">
            {secretKey.map((digit, index) => (
              <input
                key={index}
                id={`key-${index}`}
                type={showKey ? "text" : "password"}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => {
                  // Allow backspace to go to previous input
                  if (e.key === "Backspace" && !secretKey[index] && index > 0) {
                    const prevInput = document.getElementById(
                      `key-${index - 1}`
                    );
                    if (prevInput) {
                      prevInput.focus();
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasteData = e.clipboardData.getData("text").trim();
                  if (!pasteData) return;

                  // Break string into array (max 9 chars)
                  const chars = pasteData.split("").slice(0, 9);

                  // Update state
                  setSecretKey(chars);

                  // Update OTP string
                  setOtp(chars.join(""));

                  // Autofill input boxes
                  chars.forEach((ch, i) => {
                    const input = document.getElementById(`key-${i}`);
                    if (input) input.value = ch;
                  });

                  // Focus last filled box
                  const lastInput = document.getElementById(
                    `key-${chars.length - 1}`
                  );
                  if (lastInput) lastInput.focus();
                }}
                className="w-full uppercase h-12 text-center text-lg font-bold border-2 border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none transition-colors
                  dark:text-richblack-25 dark:bg-richblack-800 bg-white"
                maxLength="1"
                inputMode="text" //
                // inputMode="numeric"
                // pattern="[0-9]*"
              />
            ))}
          </div>

          {/* Hide/Show Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowKey(!showKey)}
              className="flex items-center text-gray-500 text-sm hover:text-gray-700 dark:text-richblack-200 dark:hover:text-richblack-100 transition-colors cursor-pointer"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {showKey ? "Hide" : "Hide"}
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl mb-4 transition-colors cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            "Verify Secret Key"
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center mb-8">
          <button
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className={`font-medium text-sm transition-colors cursor-pointer ${
              resendDisabled
                ? "text-red-500 opacity-50 cursor-not-allowed"
                : "text-blue-500 hover:text-blue-600"
            }`}
          >
            {resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
          </button>
        </div>

        {/* Security Features */}
        <div className="flex justify-center items-center space-x-8 text-xs text-gray-600 dark:text-richblack-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Secure</span>
          </div>
          <div className="flex items-center">
            <Lock className="w-3 h-3 mr-1" />
            <span>End-to-end encryption</span>
          </div>
          <div className="flex items-center">
            <UserCheck className="w-3 h-3 mr-1" />
            <span>Privacy</span>
          </div>
        </div>
      </div>
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}
