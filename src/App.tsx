import { useEffect, useState } from 'react';
import './App.css'
import ConnectButton from './components/ConnectButton'
import Farmyard from './components/Farmyard'
import { useEthers, useSendTransaction } from '@usedapp/core';
import { DocumentData, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './main';
import { ethers } from 'ethers';

function App() {
  const { account } = useEthers();
  const [harvest, setHarvest] = useState<DocumentData | null>(null)
  const { sendTransaction, state } = useSendTransaction();

  useEffect(() => {
    if (!account) return;

    const fetchConfig = async () => {
      const config = doc(db, "config", 'website');
      const configDoc = await getDoc(config);

      if (configDoc.exists()) {
        setHarvest(configDoc.data())
      } 
    }

    fetchConfig()
  }, [account])

  useEffect(() => {
    if (!account) return;
    if (state.status === 'Success') {
      const accountRef = doc(db, "accounts", account );
      updateDoc(accountRef, { paid: true, transactionHash: state.transaction?.hash });
    }
  }, [state, account]);
  
  const handleDonate = () => {
    if (!account) return;
    sendTransaction({ to: '0xF532A30A48bC18b4074C6930F335e5dB107CE555', value: ethers.utils.parseEther('0.05') });
  };

  const renderTransactionState = () => {
    switch (state.status) {
      case 'None':
        return <div></div>; // No transaction initiated
      case 'PendingSignature':
        return <div className="text-orange-500">Awaiting Signature...</div>;
      case 'Mining':
        return <div className="text-blue-500">Transaction is being processed...</div>;
      case 'Success':
        return <div className="text-green-500">Transaction Successful!</div>;
      case 'Fail':
        return <div className="text-red-500">Transaction Failed</div>;
      default:
        return <div></div>;
    }
  };

  return (
    <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 min-h-full pb-32 '>
      <>
        <div className="bg-theme-4 border-2 border-theme-5  rounded-sm max-w-4xl py-4  mt-8">  
          <h1 className="text-3xl font-bold text-theme-pan-navy mb-2 pt-4 text-center ">Front Gate</h1>
          <p className='text-lg text-theme-pan-navy text-center'>Welcome {account && 'back'} to Blockcrop Farm, partner.</p>
          {!account && <p className='text-lg text-theme-pan-navy text-center pb-2'>Connect your wallet to view our crops.</p>}
          {account && harvest && <p className='text-lg text-theme-pan-navy text-center pb-2'>We're currently on harvest {harvest?.harvest}, and if you care to stay we will be sending the combine harvester out on {harvest?.nextHarvest.toDate().toDateString()}</p>}
          <ConnectButton />
          {account && (
            <button onClick={handleDonate} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
              Donate 0.05 ETH
            </button>
          )}
          {renderTransactionState()}
        </div>
      </>
      <div className='text-xs text-theme-4 hidden md:block'>
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░▒▒▒▒░░░░░░░░░░░░
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░▒▒▒▒░░▒▒▓▓░░░░░░░░░░
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░▒▒░░░░░░░░░░░░▒▒▓▓░░░░░░░░
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒░░▒▒▒▒▓▓▒▒▒▒▒▒▓▓▓▓░░░░░░
        ▓▓▓▓▓▓▓▓░░▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░▒▒▒▒▒▒▓▓▒▒▓▓██▓▓▓▓▒▒▒▒▓▓██░░░░░░
        ▓▓▓▓▓▓██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓▒▒░░░░░░
        ▓▓▒▒▓▓▓▓██▓▓▓▓▒▒▒▒██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░▓▓░░░░▓▓░░▓▓░░▒▒░░░░░░░░
        ██▓▓▓▓▓▓██████▓▓▒▒▒▒▒▒▓▓▓▓██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░░░░░░░░░░░
        ▓▓██▓▓▓▓▓▓████▓▓██▓▓▒▒▒▒▓▓██████▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓░░░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░
        ▓▓▓▓██▓▓▓▓▒▒▓▓▓▓████▓▓▒▒▒▒▒▒▓▓████▒▒▒▒░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░██░░░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░
        ▓▓▓▓▓▓▓▓██▓▓▓▓▒▒▓▓▓▓▓▓██▓▓▒▒▒▒██████▓▓▒▒▒▒░░▓▓▓▓▒▒▒▒░░▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓░░░░░░░░░░░░░░░░
        ▒▒▒▒▓▓▓▓▓▓██▓▓▓▓▒▒▓▓▓▓████▓▓▒▒▒▒████████▓▓▒▒▒▒░░████▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░▓▓██▒▒░░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░
        ▓▓▒▒▓▓▒▒▒▒▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▒▒▓▓▓▓▓▓▓▓██▒▒▒▒░░▒▒▓▓████▒▒░░░░░░▒▒░░▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░
        ▓▓▓▓▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░░░▒▒▓▓▓▓██▒▒░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
        ▒▒▒▒▒▒▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▓▓▓▓▓▓▓▓▒▒▒▒░░░░▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▒▒▒▒▒▒░░░░░░░░░░
        ▒▒▒▒▒▒▒▒▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░▓▓▓▓▓▓▓▓░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░
        ▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▒▒▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓░░░░▒▒▓▓▓▓▓▓▓▓░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░
        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▒▒░░░░▒▒▒▒▓▓▓▓░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░░░
        ██▓▓▒▒▒▒▒▒▒▒▒▒▓▓██▓▓▒▒▒▒▓▓▒▒██▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░▒▒▒▒▓▓▓▓░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░
        ▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▓▓██▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▓▓▒▒▓▓▓▓▒▒██▒▒▒▒░░▒▒▒▒▒▒▓▓░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒
      </div>
      <Farmyard></Farmyard>
    </div>
  )
}

export default App
