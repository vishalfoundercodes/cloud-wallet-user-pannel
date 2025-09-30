import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import apis from "../../utils/apis";

const QrUsdtPayment = () => {
  const userId = localStorage.getItem("user_id");
  const location = useLocation();
  const navigate = useNavigate();

  // API data ke liye state
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [utrNo, setUtrNo] = useState("");

  // yaha se data milega
  const { amount, method } = location.state || { amount: null, method: null };

  const fatchQrData = async () => {
    try {
      const res = await axios.get(apis?.qrview);
      console.log("Show qr", res);

      if (res.data.success) {
        // method ke basis par filter karo
        const filtered = res.data.data.find(
          (item) => item.details.type === method
        );
        setQrData(filtered || res.data.data[0]);
      }
    } catch (err) {
      console.error("QR Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log("qrData rq", qrData);

  useEffect(() => {
    fatchQrData();
  }, [method]);

  const handleDepositSubmit = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }
    if (!utrNo) {
      toast.error("Please enter hash Id!");
      return;
    }

    const payload = {
      user_id: userId,
      amount: amount,
      deposit_method: method, // 0 = TRC20, 1 = BEP20
      //   deposit_method: method === 1 ? "TRC20" : "BEP20", // 0 = TRC20, 1 = BEP20
      utr_no: utrNo,
      hash_id: Math.random().toString(36).substring(2, 12),
    };

    console.log("Deposit payload", payload);

    try {
      setLoading(true);
      const res = await axios.post(apis?.deposit_request, payload);
      console.log("Deposit Api Response", res);

      if (res.data?.success) {
        toast.success(
          res?.data?.message ||
            res?.data?.data?.message ||
            "Deposit request submitted successfully!"
        );
        navigate(-1); // success ke baad back
      } else {
        toast.error(res.data?.message || "Failed to submit deposit request!");
      }
    } catch (error) {
      console.error("Deposit API Error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (walletAddress) => {
    if (navigator.share) {
      // Using the Web Share API - this will show ALL available share options on the device
      navigator
        .share({
          title: "Wallet Address",
          text: walletAddress, // Share only the wallet address
        })
        .then(() => {
          toast.success("Wallet address shared!");
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          if (error.name !== "AbortError") {
            toast.error("Error sharing wallet address");
          }
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      // Copy to clipboard instead
      navigator.clipboard
        .writeText(walletAddress)
        .then(() => {
          toast.success("Wallet address copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy wallet address");
        });
    }
  };

  return (
    <div className="bg-white h-full dark:bg-richblack-900 max-w-md min-h-screen mx-auto rounded-2xl shadow-lg p-6">
      <div className="">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-richblack-700 dark:bg-richblack-800 flex justify-start"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-richblack-400 dark:hover:text-blue-400" />
        </button>

        <h2 className="text-xl font-bold text-center dark:text-richblack-5">
          Deposit Request
        </h2>

        <div className="mt-6 space-y-4">
          {/* Selected Amount */}
          <p
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-richblack-800 dark:to-richblack-900 border border-gray-300 dark:border-richblack-700
           rounded-lg shadow-sm text-sm font-semibold text-gray-800 dark:text-richblack-100 flex items-center justify-between dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
          >
            <span>Selected Amount:</span>
            <span className="text-green-600 font-bold">${amount}</span>
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3 mt-6">
            <img
              src={qrData?.details?.qr_code}
              alt={qrData?.name}
              className="w-40 h-40 rounded-lg border border-gray-300 dark:border-richblack-700 shadow-md"
            />
            {/* Wallet Address */}
            <p className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-gray-100 dark:bg-richblack-800 border border-gray-300 dark:border-richblack-800 shadow-sm dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]">
              {/* <span className="text-sm font-medium text-gray-700 dark:text-richblack-200 truncate max-w-[80%]">
                {qrData?.details?.wallet_address}
              </span> */}
              <div className="flex justify-center items-center w-full">
                <span className="text-sm font-medium text-gray-700 dark:text-richblack-200 break-words max-w-[80%] text-center">
                  {qrData?.details?.wallet_address}
                </span>
                {/* <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      qrData?.details?.wallet_address || ""
                    );
                    toast.success("Wallet address copied!");
                  }}
                  className="ml-3 p-2 shrink-0 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-richblack-700 dark:hover:bg-richblack-600 transition"
                >
                  <Copy className="w-4 h-4 text-gray-600 dark:text-richblack-200 hover:text-caribbeangreen-400" />
                </button> */}
              </div>
            </p>
            {/* <div className="grid grid-cols-2 gap-2 w-full">
              <button className="bg-green-400">Share</button>
              <button
                className="bg-red-400"
                onClick={() => {
                  navigator.clipboard.writeText(
                    qrData?.details?.wallet_address || ""
                  );
                  toast.success("Wallet address copied!");
                }}
              >
                Copy
              </button>
            </div> */}
            <div className="grid grid-cols-2  gap-2 w-full">
              <button
                className="bg-green-400 p-2 text-white rounded-lg flex justify-center items-center"
                onClick={() => {
                  handleShare(qrData?.details?.wallet_address);
                  console.log(
                    "share wallet address",
                    qrData?.details?.wallet_address
                  );
                }}
              >
                Share
              </button>
              <button
                className="bg-red-400 p-2 text-white rounded-lg flex justify-center items-center"
                // onClick={() => handleCopy(qrData?.details?.wallet_address)}
                onClick={() => {
                  navigator.clipboard.writeText(
                    qrData?.details?.wallet_address || ""
                  );
                  toast.success("Wallet address copied!");
                }}
              >
                Copy
              </button>
            </div>
            {/* UTR No Input */}
            <div className="w-full mt-2">
              <label
                htmlFor="utr"
                className="block text-sm font-medium text-gray-700 dark:text-richblack-200 mb-2"
              >
                Enter hash Id:
              </label>
              <input
                type="text"
                id="utr"
                value={utrNo}
                onChange={(e) => setUtrNo(e.target.value)}
                placeholder="Enter your hash Id"
                className="w-full py-3 px-4 rounded-lg bg-gray-100 dark:bg-richblack-800 border border-gray-300 dark:border-richblack-700 shadow-sm dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]
                text-sm font-medium text-gray-700 dark:text-richblack-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-richblack-800 transition"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            onClick={handleDepositSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer 
            ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "dark:bg-caribbeangreen-400 dark:hover:bg-caribbeangreen-500 bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {loading ? "Submitting..." : "Confirm & Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrUsdtPayment;
