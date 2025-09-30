import React, { useEffect } from "react";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TRCImage from "../../assets/walletImage/usdtaddress.png";
import BEPImage from "../../assets/walletImage/USDT-BEP20.png";
import Visa from "../../assets/addBankImage/visa.jpeg";
import AddBankAccountDeteils from "./AddBankAccountDeteils";
import axios from "axios";
import { toast } from "react-toastify";
import apis from "../../utils/apis";
import Loader from "../../reusable_component/Loader";
import TRC20Image from "../../assets/walletImage/usdtaddress.png";
import BEP20Image from "../../assets/walletImage/USDT-BEP20.png";
import UsdtImage from "../../assets/walletImage/UsdtImage.png";
import addBankImage from "../../assets/addBankImage/bank_card.png";
import AddWalletAddress from "./AddWalletAddress";

const WithdrawalRequest = () => {
  const userId = localStorage.getItem("user_id");
  const [showModal, setShowModal] = useState({ open: false, type: null });
  const [activeModal, setActiveModal] = useState(1);
  // New State
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState("10"); // New state for selected amount
  const [showAll, setShowAll] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState([]); // 👈 API se data store
  const [trcWallets, setTrcWallets] = useState([]);
  const [bepWallets, setBepWallets] = useState([]);

  const toggleModal = (modalType) => {
    setActiveModal(modalType);
  };

  // Function to handle amount selection
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setUsdtAmount(amount);
  };

  // Function to handle manual input change
  const handleInputChange = (e) => {
    setSelectedAmount(e.target.value);
    setUsdtAmount(e.target.value);
  };

  // Validation function (you can implement as needed)
  const validateAmount = (amount) => {
    // Add your validation logic here
    console.log("Validating amount:", amount);
  };

  const payMethod = [
    {
      image: TRCImage,
      name: "TRC20",
      type: 1,
    },

    {
      image: BEPImage,
      name: "BEP20",
      type: 2,
    },

    {
      image: addBankImage,
      name: "Add Bank",
      type: 0,
    },
  ];

  // API call to fetch bank details
  const fetchWalletsByType = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apis?.bankdetails}?userid=${userId}&type=${type}`
      );
      console.log("Fetch url hai",  `${apis?.bankdetails}?userid=${userId}&type=${type}`);
      console.log("Fetch response", res);

      if (res.data.success) {
        const data = res.data.data || [];
        if (type === 0) setBankDetails(data);
        else if (type === 1) setTrcWallets(data);
        else if (type === 2) setBepWallets(data);

        // ✅ restore last selected bank only for type=0
        if (type === 0) {
          const savedBankId = localStorage.getItem("selectedBankId");
          if (savedBankId && data.some((b) => b.id === Number(savedBankId))) {
            setSelectedBankId(Number(savedBankId));
          } else if (data.length > 0) {
            setSelectedBankId(data[0].id);
          }
        }
        if (type === 1) {
          setTrcWallets(data);
          const savedTrcId = localStorage.getItem("selectedTrcWalletId");
          if (savedTrcId && data.some((w) => w.id === Number(savedTrcId))) {
            setSelectedWalletId(Number(savedTrcId));
          } else if (data.length > 0) {
            setSelectedWalletId(data[0].id);
          }
        }

        if (type === 2) {
          setBepWallets(data);
          const savedBepId = localStorage.getItem("selectedBepWalletId");
          if (savedBepId && data.some((w) => w.id === Number(savedBepId))) {
            setSelectedWalletId(Number(savedBepId));
          } else if (data.length > 0) {
            setSelectedWalletId(data[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching wallets by type:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletsByType(0); // Bank
    fetchWalletsByType(1); // TRC20
    fetchWalletsByType(2); // BEP20
  }, [userId]);

  // Submit withdrawal request function
  const handleSubmit = async () => {
    if (activeModal === 0 && !selectedBankId) {
      toast.error("Please select a bank account");
      return;
    }
    if ((activeModal === 1 || activeModal === 2) && !selectedWalletId) {
      toast.error("Please select a wallet address");
      return;
    }
    if (!selectedAmount || selectedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedAmount || selectedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        account_id: activeModal === 0 ? selectedBankId : selectedWalletId,
        user_id: userId, // from localStorage
        type: activeModal, // 👈 should be 0, 1, or 2 based on your selection
        amount: selectedAmount,
      };

      console.log("withdrawal payload", payload);

      const res = await axios.post(apis?.withdraw_request, payload);
      console.log("Withdrawal api response", res);

      if (res.data.success) {
        toast.success(
          res.data.message || "Withdraw request submitted successfully."
        );
        setSelectedAmount("");
        setUsdtAmount("");
        setSelectedBankId(null);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting withdrawal request:", err);
      toast.error(err?.response?.data?.message||"Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  // Bank Card Component
  const BankCard = ({ bank }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        onClick={() => setSelectedBankId(bank.id)} // ✅ update selected
        className={`bg-white dark:bg-richblack-800 rounded-lg shadow-sm dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] mb-3 overflow-hidden cursor-pointer ${
          selectedBankId === bank.id
            ? "border-b-1 border-yellow-50"
            : "border-gray-200 dark:border-richblack-700"
        }`}
      >
        <div
          className="flex items-center justify-between p-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full">
              <CreditCard className="w-5 h-5 text-gray-600 dark:text-yellow-200" />
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-700 dark:text-richblack-200">
                {bank.account_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-richblack-400">
                ****{String(bank.account_number).slice(-4)}
              </p>

              {/* <p className="text-sm text-gray-500 dark:text-richblack-400">
                {String(bank.account_number)}
              </p> */}
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Dropdown Details */}
        {isOpen && (
          <div className="p-3 border-t border-gray-200 dark:border-richblack-700 text-sm text-gray-600 dark:text-richblack-300 space-y-1">
            <p>
              <span className="font-medium">Account No:</span>{" "}
              {bank.account_number}
            </p>
            <p>
              <span className="font-medium">Branch:</span> {bank.bank_branch}
            </p>
            <p>
              <span className="font-medium">IFSC:</span> {bank.ifsc_code}
            </p>
            <p>
              <span className="font-medium">IBAN:</span> {bank.IBAN_number}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Sirf wallet address ke liye simple card
  const WalletCard = ({ wallet }) => {
    const [isOpen, setIsOpen] = useState(false);
// console.log("wallet.id",wallet.id)
    return (
      <div
        // onClick={() => setSelectedWalletId(wallet.id)} // ✅ select wallet on click
        // Wallet card click par
        onClick={() => {
          setSelectedWalletId(wallet.id);
          if (activeModal === 1) {
            localStorage.setItem("selectedTrcWalletId", wallet.id);
          } else if (activeModal === 2) {
            localStorage.setItem("selectedBepWalletId", wallet.id);
          }
        }}
        className={`bg-white dark:bg-richblack-800 rounded-lg shadow-sm mb-3 overflow-hidden cursor-pointer ${
          selectedWalletId === wallet.id
            ? "border-b-1 border-yellow-50"
            : "border-gray-200 dark:border-richblack-700"
        }`}
      >
        <div
          className="flex items-center justify-between p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-gray-700 dark:text-richblack-200 font-medium">
            {wallet.wallet_address.slice(0, 10)}...{/* Shortened */}
          </p>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {isOpen && (
          <div className="p-3 border-t border-gray-200 dark:border-richblack-700 text-sm text-gray-600 dark:text-richblack-300">
            <p>
              <span className="font-medium">Wallet Address:</span>{" "}
              {wallet.wallet_address}
            </p>
          </div>
        )}
      </div>
    );
  };
// console.log("trcWallets",trcWallets)
  return (
    <div className="bg-white dark:bg-richblack-900 max-w-md min-h-screen mx-auto rounded-2xl shadow-lg p-6">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)} // 👈 back le jayega
        className=" p-1 rounded-full hover:bg-gray-100 dark:hover:bg-richblack-700 dark:bg-richblack-800 flex justify-start"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-richblack-400 dark:hover:text-blue-400" />
      </button>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <ArrowUpRight className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-center dark:text-richblack-5">
        Request Withdrawal
      </h2>
      <p className="text-gray-500 dark:text-richblack-400 text-center text-[14px] mt-1 mb-6">
        Submit a withdrawal request{" "}
        <span className="dark:text-[#47A5C5] italic">
          to transfer funds from your wallet
        </span>
      </p>

      {/* Switch Tab - Improved alignment */}
      {/* switch tab */}
      <div className="ml-4">
        <div className="w-full grid grid-cols-3 gap-3 mt-2">
          {payMethod &&
            payMethod?.map((item, i) => (
              <div
                onClick={() => toggleModal(item?.type)}
                key={i}
                className={`col-span-1 mb-2 p-1 rounded-md flex flex-col items-center text-xsm justify-evenly ${
                  item?.type == activeModal
                    ? "bg-gradient-to-l from-[#6B7280] to-[#9CA3AF] dark:bg-gradient-to-b dark:from-[#7AFEC3] dark:to-[#02AFB6] text-white"
                    : "bg-gray-100 dark:bg-richblack-800 dark:text-richblack-400 text-gray dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
                } shadow-md text-bg6 cursor-pointer`}
              >
                <img
                  className={`w-${item?.type === 2 ? 18 : 30} h-10`}
                  src={item.image}
                  alt="UPI Payment"
                />
                <div className="font-serif">
                  <p
                    className={`${
                      item?.type == activeModal
                        ? "text-nowrap text-[12px] text-white font-semibold"
                        : "text-gray-500 text-[12px]"
                    }`}
                  >
                    {item?.name}
                  </p>
                  {/* <p className={`${item?.type == activeModal ? "text-nowrap text-white font-semibold" : "text-bg6" }`}>Payment</p> */}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Amount Selection Section - ADD BANK ACCOUNT tabs */}
      {activeModal == 0 && (
        <div className="bg-gray-50 dark:bg-richblack-900 rounded-lg p-4 shadow-sm">
          {/* {add bank details} */}
          {/* Bank Cards Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700 font-semibold dark:text-richblack-200">
                Bank Cards
              </div>

              {/* View More logic */}
              {bankDetails.length > 0 && (
                <div
                  onClick={() => setShowAll(!showAll)}
                  className="text-[12px] text-gray-600 font-semibold hover:text-gray-800 mt-1 border border-gray-200 px-2 py-1 rounded-lg cursor-pointer dark:text-richblack-400 dark:hover:text-richblack-200 dark:border-richblack-600"
                >
                  {showAll ? "View Less" : "View More"}
                </div>
              )}
            </div>

            <div className="mt-2">
              {/* CASE 1: No banks */}
              {bankDetails.length === 0 && (
                <div
                  className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                  onClick={() => setShowModal({ open: true, type: 0 })}
                >
                  <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                  </div>
                  <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                    Add New Bank Account
                  </p>
                </div>
              )}

              {/* CASE 2: One bank */}
              {bankDetails.length === 1 && (
                <>
                  <BankCard bank={bankDetails[0]} />
                  {showAll && (
                    <div>
                      {/* Add New */}
                      <div
                        className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                        onClick={() => setShowModal({ open: true, type: 0 })}
                      >
                        <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                          <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                        </div>
                        <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                          Add New Bank Account
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* CASE 3: Multiple banks */}
              {bankDetails.length > 1 && (
                <>
                  {/* ✅ Sirf selected bank dikhao */}
                  {bankDetails
                    .filter((bank) => bank.id === selectedBankId) // sirf selected bank
                    .map((bank) => (
                      <BankCard key={bank.id} bank={bank} />
                    ))}

                  {/* ✅ View More pe baki banks dikhao */}
                  {showAll &&
                    bankDetails
                      .filter((bank) => bank.id !== selectedBankId) // selected ko chhod ke baki sab
                      .map((bank) => <BankCard key={bank.id} bank={bank} />)}

                  {/* ✅ Add New bhi sirf View More me */}
                  {showAll && (
                    <div
                      className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                      onClick={() => setShowModal({ open: true, type: 0 })}
                    >
                      <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                      </div>
                      <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                        Add New Bank Account
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bank Modal */}
            {showModal.open && showModal.type === 0 && (
              <AddBankAccountDeteils setShowModal={setShowModal}   fetchWalletsByType={  fetchWalletsByType} />
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-200 dark:bg-richblack-800 w-full rounded-lg  dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] p-2">
              <div className="flex items-center justify-center text-lg font-bold text-gray-600 mr-3 dark:text-richblack-200">
                <img src={UsdtImage} alt="USDT" className="w-5 h-5" />
              </div>
              <div className="w-[1px] bg-gray-300 dark:bg-richblack-400 h-5 mr-3"></div>
              <input
                value={usdtAmount || ""}
                onChange={(e) => {
                  const numericAmount = Number(e.target.value);
                  setUsdtAmount(e.target.value);
                  setSelectedAmount(e.target.value);
                  validateAmount(numericAmount);
                }}
                type="number"
                placeholder="Please enter the amount"
                className="w-full bg-gray-200 dark:bg-richblack-800 border-none focus:outline-none text-gray-700 dark:text-richblack-100 placeholder:text-gray-400 text-sm font-semibold
                          [&::-webkit-outer-spin-button]:appearance-none
                          [&::-webkit-inner-spin-button]:appearance-none
                          [&::-moz-number-spin-box]:appearance-none"
              />
            </div>
          </div>

          {/* Quick Amount Selection Buttons */}

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors
                  dark:bg-richblack-800 dark:text-richblack-400 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:hover:bg-richblack-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors
                dark:bg-caribbeangreen-400 dark:text-richblack-900 dark:hover:bg-caribbeangreen-500 cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}

      {/* Amount Selection Section -  TRC20 tab*/}
      {/* Amount Selection Section -  TRC20 tab*/}
      {activeModal == 1 && (
        <div className="bg-gray-50 dark:bg-richblack-900 rounded-lg p-4 shadow-sm">
          {/* Wallet Cards Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700 font-semibold dark:text-richblack-200">
                Wallet Address
              </div>

              {/* View More logic */}
              {trcWallets.length > 0 && (
                <div
                  onClick={() => setShowAll(!showAll)}
                  className="text-[12px] text-gray-600 font-semibold hover:text-gray-800 mt-1 border border-gray-200 px-2 py-1 rounded-lg cursor-pointer dark:text-richblack-400 dark:hover:text-richblack-200 dark:border-richblack-600"
                >
                  {showAll ? "View Less" : "View More"}
                </div>
              )}
            </div>

            <div className="mt-2">
              {/* CASE 1: No wallets */}
              {trcWallets.length === 0 && (
                <div
                  className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                  onClick={() => setShowModal({ open: true, type: 1 })}
                >
                  <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                  </div>
                  <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                    Add New Wallet Address
                  </p>
                </div>
              )}

              {/* CASE 2: One wallet */}
              {trcWallets.length === 1 && (
                <>
                  <WalletCard wallet={trcWallets[0]} />
                  {showAll && (
                    <div
                      className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                      onClick={() => setShowModal({ open: true, type: 1 })}
                    >
                      <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                      </div>
                      <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                        Add New Wallet Address
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* CASE 3: Multiple wallets */}
              {trcWallets.length > 1 && (
                <>
                  {/* ✅ Sirf selected wallet dikhana */}
                  {trcWallets
                    .filter((wallet) => wallet.id === selectedWalletId)
                    .map((wallet) => (
                      <WalletCard key={wallet.id} wallet={wallet} />
                    ))}

                  {/* ✅ Baki wallets + Add New sirf View More pe */}
                  {showAll &&
                    trcWallets
                      .filter((wallet) => wallet.id !== selectedWalletId)
                      .map((wallet) => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                      ))}

                  {showAll && (
                    <div
                      className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                      onClick={() => setShowModal({ open: true, type: 1 })}
                    >
                      <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                      </div>
                      <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                        Add New Wallet Address
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* TRC20 Modal */}
            {showModal.open && showModal.type === 1 && (
              <AddWalletAddress setShowModal={setShowModal} walletType={1} fetchWalletsByType={fetchWalletsByType} />
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-200 dark:bg-richblack-800 w-full rounded-lg p-2">
              <div className="flex items-center justify-center text-lg font-bold text-gray-600 mr-3 dark:text-richblack-200">
                <img src={TRC20Image} alt="USDT" className="w-5 h-5" />
              </div>
              <div className="w-[1px] bg-gray-300 dark:bg-richblack-400 h-5 mr-3"></div>
              <input
                value={usdtAmount || ""}
                onChange={(e) => {
                  const numericAmount = Number(e.target.value);
                  setUsdtAmount(e.target.value);
                  setSelectedAmount(e.target.value);
                  validateAmount(numericAmount);
                }}
                type="number"
                placeholder="Please enter the amount"
                className="w-full bg-gray-200 dark:bg-richblack-800 border-none focus:outline-none text-gray-700 dark:text-richblack-100 placeholder:text-gray-400 text-sm font-semibold
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-moz-number-spin-box]:appearance-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors
        dark:bg-richblack-800 dark:text-richblack-400 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:hover:bg-richblack-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors
      dark:bg-caribbeangreen-400 dark:text-richblack-900 dark:hover:bg-caribbeangreen-500 cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}

      {/* Amount Selection Section - BEP20 tab */}
      {activeModal == 2 && (
        <div className="bg-gray-50 dark:bg-richblack-900 rounded-lg p-4 shadow-sm">
          {/* Wallet Cards Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700 font-semibold dark:text-richblack-200">
                Wallet Address
              </div>

              {/* View More logic */}
              {bepWallets.length > 0 && (
                <div
                  onClick={() => setShowAll(!showAll)}
                  className="text-[12px] text-gray-600 font-semibold hover:text-gray-800 mt-1 border border-gray-200 px-2 py-1 rounded-lg cursor-pointer dark:text-richblack-400 dark:hover:text-richblack-200 dark:border-richblack-600"
                >
                  {showAll ? "View Less" : "View More"}
                </div>
              )}
            </div>

            <div className="mt-2">
              {/* CASE 1: No wallets */}
              {bepWallets.length === 0 && (
                <div
                  className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                  onClick={() => setShowModal({ open: true, type: 2 })}
                >
                  <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                    <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                  </div>
                  <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                    Add New Wallet Address
                  </p>
                </div>
              )}

              {/* CASE 2: One wallet */}
              {bepWallets.length === 1 && (
                <>
                  <WalletCard wallet={bepWallets[0]} />
                  {showAll && (
                    <div
                      className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                      onClick={() => setShowModal({ open: true, type: 2 })}
                    >
                      <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                      </div>
                      <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                        Add New Wallet Address
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* CASE 3: Multiple wallets */}
              {bepWallets.length > 1 && (
                <>
                  {/* ✅ Sirf selected wallet dikhana */}
                  {bepWallets
                    .filter((wallet) => wallet.id === selectedWalletId)
                    .map((wallet) => (
                      <WalletCard key={wallet.id} wallet={wallet} />
                    ))}

                  {/* ✅ Baki wallets + Add New sirf View More pe */}
                  {showAll &&
                    bepWallets
                      .filter((wallet) => wallet.id !== selectedWalletId)
                      .map((wallet) => (
                        <WalletCard key={wallet.id} wallet={wallet} />
                      ))}

                  {showAll && (
                    <div
                      className="mb-2 flex items-center bg-white dark:bg-richblack-800 border border-dashed border-gray-200 dark:border-richblack-700 p-1 rounded-lg cursor-pointer"
                      onClick={() => setShowModal({ open: true, type: 2 })}
                    >
                      <div className="bg-gray-200 dark:bg-richblack-700 p-2 rounded-full mr-3">
                        <Plus className="w-4 h-4 text-gray-600 dark:text-richblack-300" />
                      </div>
                      <p className="text-gray-700 dark:text-richblack-300 font-medium text-[14px]">
                        Add New Wallet Address
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* BEP20 Modal */}
            {showModal.open && showModal.type === 2 && (
              <AddWalletAddress setShowModal={setShowModal} walletType={2} fetchWalletsByType={fetchWalletsByType}/>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <div className="flex items-center bg-gray-200 dark:bg-richblack-800 w-full rounded-lg p-2">
              <div className="flex items-center justify-center text-lg font-bold text-gray-600 mr-3 dark:text-richblack-200">
                <img src={BEP20Image} alt="USDT" className="w-5 h-5" />
              </div>
              <div className="w-[1px] bg-gray-300 dark:bg-richblack-400 h-5 mr-3"></div>
              <input
                value={usdtAmount || ""}
                onChange={(e) => {
                  const numericAmount = Number(e.target.value);
                  setUsdtAmount(e.target.value);
                  setSelectedAmount(e.target.value);
                  validateAmount(numericAmount);
                }}
                type="number"
                placeholder="Please enter the amount"
                className="w-full bg-gray-200 dark:bg-richblack-800 border-none focus:outline-none text-gray-700 dark:text-richblack-100 placeholder:text-gray-400 text-sm font-semibold
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-moz-number-spin-box]:appearance-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors
      dark:bg-richblack-800 dark:text-richblack-400 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] dark:hover:bg-richblack-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors
    dark:bg-caribbeangreen-400 dark:text-richblack-900 dark:hover:bg-caribbeangreen-500 cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequest;
