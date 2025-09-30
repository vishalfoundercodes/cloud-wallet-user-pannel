import React from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import { useState } from 'react';
import { Import } from 'lucide-react';
import Loader from '../../reusable_component/Loader';

const AddWalletAddress = ({ setShowModal, walletType,fetchWalletsByType }) => {
  const userId = localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wallet_address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.wallet_address) {
      toast.error("Please fill all required fields");
      return;
    }

    const walletPayload = {
      user_id: userId,
      wallet_address: formData.wallet_address,
      type: walletType, // 👈 1 = TRC20, 2 = BEP20
    };

    try {
      setLoading(true);
      const res = await axios.post(`${apis?.add_bank_account}`, walletPayload);
      console.log("add wallet address", res);
      console.log("wallet address payload", walletPayload);

      if (res.data.status) {
        fetchWalletsByType(walletType)
        toast.success(res.data.message || "Wallet address saved successfully");
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to save wallet address");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message||"Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white dark:bg-richblack-900 w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-600 dark:text-richblack-400 dark:hover:text-pink-400
            dark:bg-richblack-800 dark:rounded-full w-8 h-8 font-extrabold hover:text-pink-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-richblack-100">
          {walletType === 1 ? "Add TRC20 Address" : "Add BEP20 Address"}
        </h2>

        <div className="space-y-4 text-[14px]">
          <div className="flex flex-col space-y-1">
            <label className="text-gray-700 dark:text-richblack-200">
              Wallet Address <span className="text-pink-200">*</span>
            </label>
            <input
              type="text"
              required
              name="wallet_address"
              value={formData.wallet_address}
              onChange={handleChange}
              placeholder="Enter Wallet Address"
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-richblack-800 
                dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]
                dark:bg-richblack-800 dark:text-richblack-100"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 dark:bg-caribbeangreen-400 dark:hover:bg-caribbeangreen-500
            text-white font-semibold transition"
        >
          Save Wallet Address
        </button>
      </div>
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};


export default AddWalletAddress