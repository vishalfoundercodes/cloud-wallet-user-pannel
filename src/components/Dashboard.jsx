import React from 'react'
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Wallet, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";
import apis from "../utils/apis"
import Loader from '../reusable_component/Loader';
import UsdtImage from "../assets/walletImage/UsdtImage.png"

export default function Dashboard({profile, setProfile}) {

    const id = localStorage.getItem("user_id")
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apis?.get_profile}?user_id=${id}`);
      // console.log("profile api call", res);

      if (res.data?.status && res.data.profile) {
        setProfile(res.data.profile);
        toast.success("Profile fetched successfully!");
      } else {
        toast.warning("No profile data found!");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

    const handleEyeClick = async () => {
    if (!showBalance) {
      // If we're about to show the balance, fetch it fresh
      await fetchProfile();
    }
    setShowBalance(!showBalance);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-richblack-900 px-6 py-8">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Transactions */}
        <div className="bg-white dark:bg-richblack-800 border border-gray-300 dark:border-richblack-400 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 dark:text-richblack-25">
            Total Transactions
          </h3>
          <p className="text-3xl font-semibold mt-3 dark:text-richblack-25">{profile?.total_transaction || 0}</p>
          <p className="text-sm text-gray-500 mt-1 dark:text-richblack-400">{profile?.approve_transaction || 0} approved</p>
          <div className='flex justify-end'>
            <button 
              onClick={() => navigate("/wallet/total-transactions")}
              className="text-sm text-gray-600 dark:bg-yellow-50 dark:border-yellow-50 dark:text-richblack-900 font-semibold hover:bg-gray-200 hover:text-gray-800 mt-1 border
                dark:hover:bg-yellow-100 border-gray-200 dark:hover:border-yellow-50 px-4 py-2 rounded-lg cursor-pointer shadow-sm">
              View
            </button>
          </div>
        </div>

        {/* Total Deposit */}
        <div className="bg-white dark:bg-richblack-800 border border-gray-300 dark:border-richblack-400 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 dark:text-richblack-25">Total Deposit</h3>
          {/* <p className="text-3xl font-semibold mt-3 dark:text-caribbeangreen-300">+$2,300</p> */}
          <p className="text-3xl font-semibold mt-3 dark:text-caribbeangreen-300 flex items-center gap-2">
            <img src={UsdtImage} alt="USDT" className="w-8 h-8 mt-2" />
            +{profile?.payin || 0}
          </p>
          <div className='flex justify-end mt-5'>
            <button 
              onClick={() => navigate("/deposit-transactions")}
              className="text-sm text-gray-600 dark:bg-yellow-50 dark:border-yellow-50 dark:text-richblack-900 font-semibold hover:bg-gray-200 hover:text-gray-800 mt-1 border
                dark:hover:bg-yellow-100 border-gray-200 dark:hover:border-yellow-50 px-4 py-2 rounded-lg cursor-pointer shadow-sm">
              View
            </button>
          </div>
        </div>

        {/* Total Withdrawal*/}
        <div className="bg-white dark:bg-richblack-800 border border-gray-300 dark:border-richblack-400 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 dark:text-richblack-25">Total Withdrawal</h3>
          {/* <p className="text-3xl font-semibold text-caribbeangreen-400 mt-3">+$2,300</p> */}
         <p className="text-3xl font-semibold text-caribbeangreen-400 mt-3 flex items-center gap-2">
          <img src={UsdtImage} alt="USDT" className="w-8 h-8 mt-2" />
          +{profile?.withdraw || 0}
         </p>

          <div className='flex justify-end mt-5'>
            <button 
              onClick={() => navigate("/withdrawal-transactions")}
              className="text-sm text-gray-600 dark:bg-yellow-50 dark:border-yellow-50 dark:text-richblack-900 font-semibold hover:bg-gray-200 dark:hover:bg-yellow-100 hover:text-gray-800 mt-1 border 
                border-gray-200 dark:hover:border-yellow-50 px-4 py-2 rounded-lg cursor-pointer shadow-sm">
              View
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
       <div className="bg-[#0f0f1a] dark:bg-richblack-800 text-richblack-25 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <h3 className="text-lg font-medium">Wallet Balance</h3>
        </div>

        {/* 👇 Updated Eye button */}
        {showBalance ? (
          <EyeOff
            className="w-5 h-5 text-gray-300 cursor-pointer"
            onClick={handleEyeClick}
          />
        ) : (
          <Eye
            className="w-5 h-5 text-gray-300 cursor-pointer"
            onClick={handleEyeClick}
          />
        )}
      </div>

      {/* Balance */}
      <div>
        <p className="text-sm text-gray-300">Available Balance</p>
        <p className="text-4xl font-bold mt-1 flex items-center gap-2">
          {showBalance ? (
            <>
              <img src={UsdtImage} alt="USDT" className="w-10 h-10 mt-2" />
              {profile?.wallet ?? 0}
            </>
          ) : (
            "•••••••"
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button 
          onClick={() => navigate("/deposit-request")}
          className="bg-white dark:bg-green-400 dark:hover:bg-green-500 text-black rounded-lg py-3 font-medium hover:bg-gray-100 transition cursor-pointer"
        >
          Deposit
        </button>
        <button 
          onClick={() => navigate("/withdrawal-request")}
          className="bg-white dark:bg-richblack-600 dark:hover:bg-richblack-500 text-black dark:text-richblack-25 
            rounded-lg py-3 font-medium hover:bg-gray-100 transition cursor-pointer dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
        >
          Withdraw
        </button>
      </div>
    </div>
      
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
}
