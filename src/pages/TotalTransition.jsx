import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apis from "../utils/apis";
import Loader from "../reusable_component/Loader";
import { toast } from "react-toastify";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Copy,
  CircleCheckBig,
  X,
  ArrowLeft,
} from "lucide-react";
import TRC20Image from "../assets/walletImage/usdtaddress.png";
import bep20Image from "../assets/walletImage/USDT-BEP20.png";

const TotalTransition = () => {
      const userIdHai = localStorage.getItem("user_id");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${apis?.users_transaction_history}?user_id=${userIdHai}`);
      console.log(`total transition: ${apis?.users_transaction_history}?user_id=${userIdHai}`);
      console.log("resrsersr",res)
      if (res.data?.success) {
        setTransactions(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return {
          text: "Pending",
          color: "bg-gray-200 text-gray-700",
          icon: <Clock className="w-3 h-3" />,
        };
      case 1:
        return {
          text: "Approved",
          color: "bg-gray-900 dark:bg-richblack-600 text-white",
          icon: <CircleCheckBig className="w-3 h-3" />,
        };
      case 2:
        return {
          text: "Rejected",
          color: "bg-red-600 text-white",
          icon: <X className="w-3 h-3" />,
        };
      default:
        return { text: "Unknown", color: "bg-gray-300 text-black" };
    }
  };

  const openModal = (tx) => {
    setSelectedWithdrawal(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWithdrawal(null);
  };

  const handleCopy = () => {
    if (selectedWithdrawal?.account_number) {
      navigator.clipboard.writeText(selectedWithdrawal.account_number);
      setCopied(true);
      toast.success("Account number copied!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleCopyWallet = () => {
    if (selectedWithdrawal?.wallet_address) {
      navigator.clipboard.writeText(selectedWithdrawal.wallet_address);
      setCopied(true);
      toast.success("Wallet address copied!");
      setTimeout(() => setCopied(false), 1500);
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-richblack-900 rounded-2xl shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)} // 👈 back le jayega
          className=" p-1 rounded-full hover:bg-gray-100 dark:hover:bg-richblack-700 dark:bg-richblack-800 flex justify-start mb-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-richblack-400 dark:hover:text-blue-400" />
        </button>

        <h2 className="text-lg font-semibold mb-4 dark:text-richblack-25">
          Transaction History
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isDeposit = tx.transaction_type === "payin";
            const status = getStatus(tx.status);

            return (
              <div
                key={tx.id}
                onClick={() => openModal(tx)}
                className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-richblack-400 p-4 bg-white dark:bg-richblack-800"
              >
                {/* Left Side */}
                <div className="flex items-start space-x-3">
                  <div>
                    {isDeposit ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-richblack-25">
                      {isDeposit ? "Deposit" : "Withdrawal"} -{" "}
                      {tx.payment_type_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-richblack-400">
                      {tx.created_at}
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-center space-x-3">
                  <span
                    className={`font-semibold mb-1 flex items-center gap-1 ${
                      isDeposit
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {isDeposit ? (
                      <img
                        src={TRC20Image}
                        alt="USDT"
                        className="w-4 h-4 inline-block ml-1"
                      />
                    ) : (
                      <img
                        src={bep20Image}
                        alt="USDT"
                        className="w-4 h-4 inline-block ml-1"
                      />
                    )}
                    {isDeposit ? "+" : "-"}
                    {tx.amount}
                  </span>
                  <span
                    className={`px-3 py-1 text-[12px] font-medium rounded-xl flex items-center space-x-1 ${status.color}
                       shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer mr-1`}
                  >
                    {status.icon}
                    <span>{status.text}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
       {isModalOpen &&
             selectedWithdrawal &&
             selectedWithdrawal?.transaction_type !== "payin" && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                 <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] md:max-w-[512px] overflow-hidden">
                   {/* Header */}
                   <div className="flex justify-between items-start px-6 py-4">
                     <div className="flex flex-col gap-1">
                       <h2 className="text-lg font-bold text-gray-900">
                         {selectedWithdrawal.transaction_type === "payin"
                           ? "Deposit"
                           : "Withdraw" || "N/A"}{" "}
                         - {selectedWithdrawal.payment_type_name || "N/A"}
                       </h2>
                       <p className="text-sm text-gray-500">
                         Review withdrawal information and payment details
                       </p>
                     </div>
                     <button
                       onClick={closeModal}
                       className="p-2 text-gray-900 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>
     
                   {/* Body */}
                   <div className="px-6 space-y-5 pb-6">
                     {/* Transaction Info */}
                     {/* <div className="flex flex-col gap-1">
                     <p className="text-sm font-semibold text-gray-800">
                       Transaction
                     </p>
                     <p className="text-xs text-gray-500">
                       {selectedWithdrawal.transaction_type === "payin"
                         ? "Deposit"
                         : "Withdraw" || "N/A"}
                       - {selectedWithdrawal.payment_type_name || "N/A"}
                     </p>
                   </div> */}
     
                     {/* Basic Fields */}
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-sm font-semibold text-gray-700">
                           Withdrawal ID
                         </p>
                         <p className="text-xs text-gray-500">
                           {selectedWithdrawal.id}
                         </p>
                       </div>
                       <div>
                         <p className="text-sm font-semibold text-gray-700">
                           Amount
                         </p>
                         <p className="text-xs text-gray-500">
                           ₮{parseFloat(selectedWithdrawal.amount).toFixed(2)}
                         </p>
                       </div>
                     </div>
     
                     {/* Payment Details */}
                     <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl space-y-4">
                       <h3 className="text-sm font-semibold text-gray-900">
                         Payment Details
                       </h3>
     
                       {/* Wallet or Account Info */}
                       <div className="space-y-3">
                         {selectedWithdrawal.wallet_address ? (
                           <div>
                             <p className="text-xs font-medium text-gray-700">
                               Wallet Address
                             </p>
                             <div className="flex items-center gap-2">
                               <p className="text-xs text-gray-500 break-all">
                                 {selectedWithdrawal.wallet_address}
                               </p>
                               <button
                                 onClick={handleCopyWallet
                                 }
                                 className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-md text-xs transition"
                               >
                                 <Copy size={14} />
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div>
                             <p className="text-xs font-medium text-gray-700">
                               Account Number
                             </p>
                             <div className="flex items-center gap-2">
                               <p className="text-xs text-gray-500">
                                 {selectedWithdrawal.account_number || "N/A"}
                               </p>
                               {selectedWithdrawal?.account_number && (
                                 <button
                                   onClick={handleCopy
                                   }
                                   className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-md text-xs transition"
                                 >
                                   <Copy size={14} />
                                 </button>
                               )}
                             </div>
                           </div>
                         )}
     
                         {/* Bank Name */}
                         {selectedWithdrawal.account_name && (
                           <div>
                             <p className="text-xs font-medium text-gray-700">
                               Bank Name
                             </p>
                             <p className="text-xs text-gray-500">
                               {selectedWithdrawal.account_name}
                             </p>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
    </div>
  );
};

export default TotalTransition;
