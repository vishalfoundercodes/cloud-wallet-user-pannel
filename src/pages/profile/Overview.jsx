import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Hash, SquarePen, Plus, CreditCard, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../reusable_component/Loader';
import axios from 'axios';
import apis from '../../utils/apis';
import AddBankAccountDeteils from '../withdrawal/AddBankAccountDeteils';
import AddWalletAddress from '../withdrawal/AddWalletAddress';

// Overview Component
const Overview = ({ userData, setActiveTab, }) => {
   const userId = localStorage.getItem("user_id");
   const navigate = useNavigate();
   
    const [bankDetails, setBankDetails] = useState([]); 
    const [trcWallets, setTrcWallets] = useState([]);
    const [bepWallets, setBepWallets] = useState([]); 
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBankId, setSelectedBankId] = useState(null);
    // const [showAll, setShowAll] = useState(true);
    
    // API call to fetch bank details
  const fetchWalletsByType = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apis?.bankdetails}?userid=${userId}&type=${type}`
      );
      console.log("Fetch response bank", res);

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
  

    // Bank Card Component
    const BankCard = ({ bank }) => {
      const [isOpen, setIsOpen] = useState(false);
  
      return (
        <div
          onClick={() => setSelectedBankId(bank.id)} // ✅ update selected
          className={`bg-white dark:bg-richblack-800 rounded-lg shadow-sm dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] mb-3 overflow-hidden cursor-pointer ${
            selectedBankId === bank.id
              ? ""
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
  
      return (
        <div className="bg-white dark:bg-richblack-800 rounded-lg shadow-sm mb-3 overflow-hidden cursor-pointer">
          <div
            className="flex items-center justify-between p-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p className="text-gray-700 dark:text-richblack-200 font-medium">
              {wallet.wallet_address}
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


  return (
    <div className="min-h-screen bg-white dark:bg-richblack-900 rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <User className="w-5 h-5 mr-2 font-bold text-gray-600 dark:text-richblack-100" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-richblack-25">Personal Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-richblack-800 rounded-lg p-4 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]">
          <div className="flex items-center mb-2">
            <User className="w-4 h-4 text-gray-500 mr-2 dark:text-richblack-300" />
            <span className="text-sm text-gray-600 dark:text-richblack-5 font-medium">Full Name</span>
          </div>
          <p className="text-gray-900 dark:text-richblack-50 font-medium">{userData.fullName}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-richblack-800 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Phone className="w-4 h-4 text-gray-500 mr-2 dark:text-richblack-300" />
            <span className="text-sm text-gray-600 dark:text-richblack-5 font-medium">Phone Number</span>
          </div>
          <p className="text-gray-900 dark:text-richblack-50 font-medium">{userData.phone}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-richblack-800 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Mail className="w-4 h-4 text-gray-500 mr-2 dark:text-richblack-300" />
            <span className="text-sm text-gray-600 dark:text-richblack-5 font-medium">Email Address</span>
          </div>
          <p className="text-gray-900 dark:text-richblack-50 font-medium">{userData.email}</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-richblack-800 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] rounded-lg p-4">
          <div className="flex items-center mb-2 dark:text-richblack-300">
            <Hash className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-richblack-5 font-medium">Account ID</span>
          </div>
          <p className="text-gray-900 dark:text-richblack-50 font-medium">{userData.accountId}</p>
        </div>
      </div>
      
        <div className="bg-gray-100 dark:bg-richblack-800 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] rounded-lg p-4 mt-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-richblack-5">Member Since</span>
          </div>
          <p className="text-gray-900 dark:text-richblack-50 font-medium mt-1">{userData.memberSince}</p>
        </div>

        <div className="mt-6 flex justify-end">
          {/* <Link to="/edit-profile"> */}
            <button onClick={()=>setActiveTab("edit-profile")} className="flex items-center mb-2 rounded-2xl p-2 border border-gray-200 dark:border-yellow-50 dark:hover:bg-yellow-100 dark: bg-yellow-50 cursor-pointer">
                <SquarePen className="w-4 h-4 text-gray-500 mr-2 dark:text-richblack-900" />
                <span className="text-sm text-gray-800 dark:text-richblack-900 font-semibold">Edit Information</span>
            </button>
          {/* </Link> */}
        </div>

        <div className='mt-4'>
          {/* Bank Cards Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-700 font-semibold dark:text-richblack-200">
                Bank Cards
              </div>

              {/* View More logic */}
              {/* {bankDetails.length > 0 && (
                <div
                  onClick={() => setShowAll(!showAll)}
                  className="text-[12px] text-gray-600 font-semibold hover:bg-gray-200 hover:text-gray-800 mt-1 border border-gray-200 px-2 py-1 rounded-lg cursor-pointer shadow-sm dark:text-richblack-400 dark:hover:text-richblack-200 dark:hover:bg-richblack-700 dark:bg-richblack-800 dark:border-richblack-800"
                >
                  {showAll ? "View Less" : "View More"}
                </div>
              )} */}
              {/* {bankDetails.length > 0 && (
                <div
                  onClick={() => setShowAll(!showAll)}
                  className="text-[12px] text-gray-600 font-semibold hover:text-gray-800 mt-1 border border-gray-200 px-2 py-1 rounded-lg cursor-pointer dark:text-richblack-400 dark:hover:text-richblack-200 dark:border-richblack-800"
                >
                  {showAll ? "View Less" : "View More"}
                </div>
              )} */}
            </div>

        <div className="mt-2">
  {/* CASE 1: No banks */}
  {bankDetails.length === 0 ? (
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
  ) : (
    <>
      {/* Show all bank cards */}
      {bankDetails.map((bank) => (
        <BankCard key={bank.id} bank={bank} />
      ))}

      {/* Always show Add New button below list */}
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
    </>
  )}
</div>


            {/* Bank Modal */}
            {showModal.open && showModal.type === 0 && (
              <AddBankAccountDeteils setShowModal={setShowModal} fetchWalletsByType={fetchWalletsByType}/>
            )}
          </div> 
        </div>

    {/* TRC20 Wallet Address */}
<div className="mt-2">
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-3">
      <div className="text-gray-700 font-semibold dark:text-richblack-200">
        TRC20 Wallet Address
      </div>
    </div>

    <div className="mt-2">
      {/* CASE 1: No wallet */}
      {trcWallets.length === 0 ? (
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
      ) : (
        <>
          {/* Show all wallet cards */}
          {trcWallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}

          {/* Add New button always shown below list */}
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
        </>
      )}
    </div>

    {/* TRC20 Modal */}
    {showModal.open && showModal.type === 1 && (
      <AddWalletAddress
        setShowModal={setShowModal}
        walletType={1}
        fetchWalletsByType={fetchWalletsByType}
      />
    )}
  </div>
</div>


        {/* BEP20 Wallet Address */}
<div className="mt-2">
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-3">
      <div className="text-gray-700 font-semibold dark:text-richblack-200">
        BEP20 Wallet Address
      </div>
    </div>

    <div className="mt-2">
      {/* If no wallets, show only the Add button */}
      {bepWallets.length === 0 ? (
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
      ) : (
        <>
          {/* Show all wallet cards */}
          {bepWallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}

          {/* Add New button always below the list */}
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
        </>
      )}
    </div>

    {/* BEP20 Modal */}
    {showModal.open && showModal.type === 2 && (
      <AddWalletAddress
        setShowModal={setShowModal}
        walletType={2}
        fetchWalletsByType={fetchWalletsByType}
      />
    )}
  </div>
</div>


    </div>
  );
};

export default Overview