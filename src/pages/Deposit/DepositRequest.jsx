import React, { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../reusable_component/Loader";
import apis from "../../utils/apis";

const DepositRequest = () => {
  const [activeModal, setActiveModal] = useState(null); // default null until API load
  const [selectedAmount, setSelectedAmount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState([]);
  const navigate = useNavigate();

  const toggleModal = (modalType) => {
    setActiveModal(modalType);
  };

  // fetch payMethod from API
  useEffect(() => {
    const fetchPayMethods = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${apis.qrview}`);
        if (res.data?.success) {
          console.log(res.data.data);
          setPayMethod(res.data.data);
          setActiveModal(res.data.data[0]?.details?.type ?? null); // default first tab
        }
      } catch (error) {
        toast.error(error?.response?.data?.message||"Failed to load payment methods");
      } finally {
      setLoading(false);
    }
    };
    fetchPayMethods();
  }, []);

  return (
    <div className="bg-white dark:bg-richblack-900 min-h-screen max-w-md mx-auto rounded-2xl shadow-lg p-6">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-richblack-700 dark:bg-richblack-800 flex justify-start"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-richblack-400 dark:hover:text-blue-400" />
      </button>

      <div className="mt-5">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-200 dark:bg-caribbeangreen-400 p-4 rounded-full">
            <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-caribbeangreen-700" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center dark:text-richblack-5">
          Request Deposit
        </h2>
        <p className="text-gray-500 dark:text-richblack-400 text-center mt-1 mb-6 font-medium text-[14px]">
          Submit a deposit request{" "}
          <span className="dark:text-[#47A5C5] italic">
            to transfer funds to your wallet
          </span>
        </p>

        {/* Switch Tab from API */}
        <div className="ml-4">
          <div className="w-full grid grid-cols-3 gap-3 mt-2">
            {payMethod.map((item, i) => (
              <div
                onClick={() => toggleModal(item?.details?.type)}
                key={i}
                className={`col-span-1 mb-2 p-1 rounded-md flex flex-col items-center text-xsm justify-evenly ${
                  item?.details?.type === activeModal
                    ? "bg-gradient-to-l from-[#6B7280] to-[#9CA3AF] dark:bg-gradient-to-b dark:from-[#7AFEC3] dark:to-[#02AFB6] text-white"
                    : "bg-gray-100 dark:bg-richblack-800 dark:text-richblack-400 text-gray"
                } shadow-md text-bg6`}
              >
                <img
                  className="w-8 h-8"
                  src={item?.icon}
                  alt={item?.name}
                />
                <p
                  className={`${
                    item?.details?.type === activeModal
                      ? "text-nowrap text-[12px] text-white font-semibold"
                      : "text-gray-500 text-[12px]"
                  }`}
                >
                  {item?.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Amount Input Box with Dynamic Icon */}
        {activeModal !== null && (
          <div className="bg-gray-50 dark:bg-richblack-900 rounded-lg p-4 shadow-sm mt-4">
            <div className="mb-4">
              <div className="flex items-center bg-gray-200 dark:bg-richblack-800 w-full rounded-lg p-2">
                {/* instead of $ show icon */}
                <div className="flex items-center justify-center mr-3">
                  <img
                    src={payMethod.find((m) => m.details.type === activeModal)?.icon}
                    alt="method-icon"
                    className="w-6 h-6"
                  />
                </div>
                <div className="w-[1px] bg-gray-300 dark:bg-richblack-400 h-5 mr-3"></div>
                <input
                  value={selectedAmount || ""}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  type="number"
                  placeholder="Please enter the amount"
                  className="w-full bg-gray-200 dark:bg-richblack-800 border-none focus:outline-none dark:text-richblack-100 text-gray-700 placeholder:text-gray-400 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-3">
              <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-richblack-800 dark:text-richblack-400">
                Cancel
              </button>
              <button
                onClick={() => {
                  navigate("/qr-usdt-payment", {
                    state: { amount: selectedAmount, method: activeModal },
                  });
                }}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-800 dark:bg-caribbeangreen-400 dark:text-richblack-900 dark:hover:bg-caribbeangreen-500"
                }`}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/70 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default DepositRequest;
