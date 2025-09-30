import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../reusable_component/Loader";
import { Clock, CircleCheckBig, X, ArrowLeft, Import } from "lucide-react";
import { getTransactionMeta } from "../../reusable_component/GetTransactionMeta ";
import { useNavigate } from "react-router-dom";
import apis from "../../utils/apis";
import TRC20Image from "../../assets/walletImage/usdtaddress.png";
import BEP20Image from "../../assets/walletImage/USDT-BEP20.png";


const TotalDepositTransition = () => {
      const userIdHai = localStorage.getItem("user_id");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${apis?.Transaction_history}?user_id=${userIdHai}&type=1`);
      if (res.data?.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching deposit transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-richblack-900 rounded-2xl shadow p-6 relative">
      <div className="mt-2">
        <div className="flex items-center space-x-4 mb-4">
          {/* Back Arrow */}
          <button
            onClick={() => navigate(-1)} // 👈 back le jayega
            className=" p-1 rounded-full hover:bg-gray-100 dark:hover:bg-richblack-700 dark:bg-richblack-800 flex justify-start mb-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-richblack-400 dark:hover:text-blue-400" />
          </button>

          <h2 className="text-lg font-semibold mb-4 dark:text-richblack-25">
            Deposit Transactions
          </h2>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-richblack-400">
            No transactions found.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const { statusColor, icon, amountColor } = getTransactionMeta(
                tx,
                true
              );
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-richblack-400 p-4 bg-white dark:bg-richblack-800"
                >
                  {/* Left */}
                  <div className="flex items-start space-x-3">
                    <div>{icon}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-richblack-25">
                        {tx["Payment type name"] 
                            ? tx["Payment type name"] 
                            : tx.type === 0 
                            ? "TRC20" 
                            : "BEP20"
                        }
                       </p>

                      <p className="text-sm text-gray-500 dark:text-richblack-400">
                        {tx.created_at}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-center">
                    <span className={`font-semibold mb-1 ${amountColor} flex items-center gap-1`}>
                      <img 
                        src={tx.type === 0 ? TRC20Image : BEP20Image} 
                        alt={tx.type === 0 ? "TRC20" : "BEP20"} 
                        className="w-4 h-4 inline-block ml-1"
                      />
                      +{tx.amount}
                    </span>
                    <span
                      className={`px-3 py-1 text-[12px] font-medium rounded-xl flex items-center space-x-1 ${statusColor}
                      shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer mr-1`}
                    >
                      {tx.status === 0 && <Clock className="w-3 h-3" />}
                      {tx.status === 1 && (
                        <CircleCheckBig className="w-3 h-3 text-caribbeangreen-200" />
                      )}
                      {tx.status === 2 && <X className="w-3 h-3" />}
                      <span>
                        {tx.status === 0
                          ? "Pending"
                          : tx.status === 1
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

    </div>
  );
};

export default TotalDepositTransition;
