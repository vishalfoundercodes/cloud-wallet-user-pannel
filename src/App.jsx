// import { useState } from 'react'
// import React from 'react'
// import {Route, Routes } from "react-router-dom";
// import AuthForm from './components/AuthForm';
// import WithdrawalRequest from './pages/withdrawal/WithdrawalRequest';
// import DepositRequest from './pages/Deposit/DepositRequest';
// import SecureWallet from './pages/SecureWallet';
// import ProfileTabs from './pages/profile/ProfileTabs'
// import EditProfile from './pages/profile/EditProfile';
// import './App.css'
// import QrUsdtPayment from './pages/Deposit/QrUsdtPayment';
// import TotalDepositTransition from './pages/Deposit/TotalDepositTransition';
// import TotalWithdrawalTransition from './pages/withdrawal/TotalWithdrawalTransition';
// import TotalTransition from './pages/TotalTransition';
// import OtpVerify from './components/OtpVerify';
// import ProtectedRoute from '../src/pages/Auth/ProtectedRoutes';
// import GuestRoute from '../src/pages/Auth/GuestRoute';
// function App() {

//   return (
//     <>
//       <div className='w-screen min-h-screen dark:bg-richblack-800'>

//         <Routes>
//           {/* <Route path="/" element={<Home/>} /> */}
//           <Route
//             path="/"
//             element={<AuthForm />}
//           />

//           {/* Source route */}
//           <Route
//             path="/wallet"
//             element={<SecureWallet />}
//           />

//           {/* WithdrawalRequest */}
//           <Route
//             path='/withdrawal-request'
//             element={<WithdrawalRequest/>}
//           />

//           {/* DepositRequest */}
//           <Route
//             path='/deposit-request'
//             element={<DepositRequest/>}
//           />  

//           {/* Profile */}
//           <Route
//             path='/profile'
//             element={<ProfileTabs/>}
//           />  

//           {/* QrUsdt payment */}
//           <Route 
//             path="/qr-usdt-payment" 
//             element={<QrUsdtPayment />} />

//           {/* TotalDepositTransition */}
//           <Route 
//             path="/deposit-transactions" 
//             element={<TotalDepositTransition />} 
//           />

//           {/* TotalWithdrawalTransition */}
//           <Route 
//             path="/withdrawal-transactions" 
//             element={<TotalWithdrawalTransition />} 
//           />

//            {/* TotalTransition */}
//           <Route 
//             path="/wallet/total-transactions" 
//             element={<TotalTransition />} 
//           />

//           <Route 
//             path="/verify-otp" 
//             element={<OtpVerify />} 
//           />

//         </Routes>
      
//       </div>
//     </>
//   )
// }

// export default App



// import { Routes, Route } from "react-router-dom";
// import AuthForm from './components/AuthForm';
// import WithdrawalRequest from './pages/withdrawal/WithdrawalRequest';
// import DepositRequest from './pages/Deposit/DepositRequest';
// import SecureWallet from './pages/SecureWallet';
// import ProfileTabs from './pages/profile/ProfileTabs';
// import EditProfile from './pages/profile/EditProfile';
// import QrUsdtPayment from './pages/Deposit/QrUsdtPayment';
// import TotalDepositTransition from './pages/Deposit/TotalDepositTransition';
// import TotalWithdrawalTransition from './pages/withdrawal/TotalWithdrawalTransition';
// import TotalTransition from './pages/TotalTransition';
// import OtpVerify from './components/OtpVerify';

// import ProtectedRoute from '../src/pages/Auth/ProtectedRoutes';
// import GuestRoute from '../src/pages/Auth/GuestRoute';

// function App() {
//   return (
//     <div className='w-screen min-h-screen dark:bg-richblack-800'>
//       <Routes>

//         {/* Guest-only routes */}
//         <Route element={<GuestRoute />}>
//           <Route path="/" element={<AuthForm />} />
//           <Route path="/verify-otp" element={<OtpVerify />} />
//         </Route>

//         {/* Protected (logged-in) routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/wallet" element={<SecureWallet />} />
//           <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
//           <Route path="/deposit-request" element={<DepositRequest />} />
//           <Route path="/profile" element={<ProfileTabs />} />
//           <Route path="/edit-profile" element={<EditProfile />} />
//           <Route path="/qr-usdt-payment" element={<QrUsdtPayment />} />
//           <Route path="/deposit-transactions" element={<TotalDepositTransition />} />
//           <Route path="/withdrawal-transactions" element={<TotalWithdrawalTransition />} />
//           <Route path="/wallet/total-transactions" element={<TotalTransition />} />
//         </Route>

//       </Routes>
//     </div>
//   );
// }

// export default App;

import { useState } from 'react'
import React from 'react'
import { Routes, Route } from "react-router-dom";
import AuthForm from './components/AuthForm';
import OtpVerify from './components/OtpVerify';
import DepositRequest from './pages/Deposit/DepositRequest';
import WithdrawalRequest from './pages/withdrawal/WithdrawalRequest';
import SecureWallet from './pages/SecureWallet';
import ProfileTabs from './pages/profile/ProfileTabs';
import EditProfile from './pages/profile/EditProfile';
import QrUsdtPayment from './pages/Deposit/QrUsdtPayment';
import TotalDepositTransition from './pages/Deposit/TotalDepositTransition';
import TotalWithdrawalTransition from './pages/withdrawal/TotalWithdrawalTransition';
import TotalTransition from './pages/TotalTransition';

import ProtectedRoute from '../src/pages/Auth/ProtectedRoutes';
import GuestRoute from '../src/pages/Auth/GuestRoute';

function App() {
  return (
    <div className="w-screen min-h-screen dark:bg-richblack-800">
      <Routes>

        {/* 👤 Guest Routes */}
        <Route element={<GuestRoute />}>
          <Route path="/" element={<AuthForm />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
        </Route>

        {/* 🔐 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wallet" element={<SecureWallet />} />
          <Route path="/deposit-request" element={<DepositRequest />} />
          <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
          <Route path="/profile" element={<ProfileTabs />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/qr-usdt-payment" element={<QrUsdtPayment />} />
          <Route path="/deposit-transactions" element={<TotalDepositTransition />} />
          <Route path="/withdrawal-transactions" element={<TotalWithdrawalTransition />} />
          <Route path="/wallet/total-transactions" element={<TotalTransition />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
