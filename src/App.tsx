import { useEffect, useState } from 'react';
import './App.css'
import ConnectButton from './components/ConnectButton'
import Farmyard from './components/Farmyard'
import { useEthers } from '@usedapp/core';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { db } from './main';

function App() {
  const { account } = useEthers();
  const [harvest, setHarvest] = useState<DocumentData | null>(null)

  useEffect(() => {
    if (!account) return;

    const fetchConfig = async () => {
      const config = doc(db, "config", 'website');
      const configDoc = await getDoc(config);
      console.log(configDoc.data())
      if (configDoc.exists()) {
        console.log(configDoc.data().nextHarvest)
        setHarvest(configDoc.data())
      } else {

      }
    }

    fetchConfig()
  }, [account])

  return (
    <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 min-h-full '>

      <>
        <div className="bg-theme-4 border-2 border-theme-5  rounded-sm max-w-4xl py-4 mb-4 mt-8">
          <h1 className="text-3xl font-bold text-theme-pan-navy mb-2 text-center ">Front Gate</h1>
          <p className='text-lg text-theme-pan-navy text-center'>Welcome {account && 'back'} to Blockcrop Farm, partner.</p>
          {!account && <p className='text-lg text-theme-pan-navy text-center pb-2'>Connect your wallet to view our crops.</p>}
          {account && harvest && <p className='text-lg text-theme-pan-navy text-center pb-2'>We're currently on harvest {harvest?.harvest}, and if you care to stay we will be sending the combine harvester out on {harvest?.nextHarvest.toDate().toDateString()}</p>}
          <ConnectButton />

        </div>
      </>

      <Farmyard></Farmyard>
    </div>
  )
}

export default App
