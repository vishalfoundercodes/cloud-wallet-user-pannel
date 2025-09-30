import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CircleCheckBig,
  X,
  Import,
} from "lucide-react";
import TRC20Image from "../assets/walletImage/usdtaddress.png";
import bep20Image from "../assets/walletImage/USDT-BEP20.png";
import apis from "../utils/apis";

export default function TransactionHistory() {
  const userIdHai = localStorage.getItem("user_id");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${apis?.users_transaction_history}?user_id=${userIdHai}`);
      console.log("transation history", res)
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

  return (
    <div className="bg-white dark:bg-richblack-900 rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-richblack-25">
        Transaction History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => {
            const isDeposit = tx.transaction_type === "payin";
            const status = getStatus(tx.status);

            return (
              <div
                key={tx.id}
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
    </div>
  );
}
