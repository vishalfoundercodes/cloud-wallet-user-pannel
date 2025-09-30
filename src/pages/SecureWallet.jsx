import React, { useState } from 'react'
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import TransactionHistory from '../components/TransactionHistory';

const SecureWallet = () => {
  const [profile, setProfile] = useState(null);
  return (
    <div>
        <div>
            <Header profile={profile}/>
        </div>
        
        <div >
            <Dashboard profile={profile} setProfile={setProfile} />
        </div>

        <div>
            <TransactionHistory/>
        </div>
    </div>
  )
}

export default SecureWallet