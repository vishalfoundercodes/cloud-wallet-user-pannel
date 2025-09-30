import React from 'react'
import {Shield, Check} from 'lucide-react';
import { useState } from 'react';

// Verification Component
const Verification = ({ userData }) => {
//   const [twoFA, setTwoFA] = useState(userData.twoFAEnabled);

//   const toggleTwoFA = () => {
//     setTwoFA(!twoFA);
//     alert(`2FA ${!twoFA ? 'enabled' : 'disabled'} successfully!`);
//   };

  return (
    // <div className="bg-white rounded-lg p-6 shadow-sm">
    //   <div className="flex items-center mb-6">
    //     <Check className="w-5 h-5 mr-2 text-gray-600" />
    //     <h2 className="text-lg font-semibold text-gray-800">Verification Settings</h2>
    //   </div>
      
    //   <div className="space-y-6">
    //     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
    //       <div className="flex items-center">
    //         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
    //           <Check className="w-4 h-4 text-green-600" />
    //         </div>
    //         <div>
    //           <h3 className="font-medium text-gray-800">Email Verified</h3>
    //           <p className="text-sm text-gray-600">Your email address has been verified</p>
    //         </div>
    //       </div>
    //       <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
    //         Verified
    //       </span>
    //     </div>
        
    //     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
    //       <div className="flex items-center">
    //         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
    //           <Shield className="w-4 h-4 text-blue-600" />
    //         </div>
    //         <div>
    //           <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
    //           <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
    //         </div>
    //       </div>
    //       <button
    //         onClick={toggleTwoFA}
    //         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
    //           twoFA ? 'bg-blue-600' : 'bg-gray-200'
    //         }`}
    //       >
    //         <span
    //           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
    //             twoFA ? 'translate-x-6' : 'translate-x-1'
    //           }`}
    //         />
    //       </button>
    //     </div>
        
    //     <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
    //       <h3 className="font-medium text-gray-800 mb-2">Verification Name</h3>
    //       <p className="text-sm text-gray-600 mb-3">
    //         This name will be used for verification purposes across the platform
    //       </p>
    //       <div className="flex items-center justify-between">
    //         <span className="text-gray-800 font-medium">{userData.fullName}</span>
    //         <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
    //           Update
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>Verification</div>
  );
};

export default Verification