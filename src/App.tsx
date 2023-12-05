import { useEffect, useState } from 'react';
import './App.css'
import ConnectButton from './components/ConnectButton'
import Farmyard from './components/Farmyard'
import { Optimism, Arbitrum, Polygon, useEthers, useSendTransaction, Mainnet } from '@usedapp/core';
import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './main';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ALLOWED_NETWORKS, WOJAK_JONES_FARM_ADDRESS } from './constants';
import { ethers } from 'ethers';
import Harvest from './components/Harvest';

function App(): JSX.Element {
  const { account, library, chainId } = useEthers();
  const [harvest, setHarvest] = useState<DocumentData | null>(null);
  const { state, sendTransaction } = useSendTransaction();
  const [open, setOpen] = useState<boolean>(false);
  const [openTip, setOpenTip] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'Crop Fields' | 'Harvest' | 'Storage'>('Crop Fields');

  useEffect(() => {
    if (!account) return;
    fetchConfig();
    checkPendingTransaction();
  }, [account, library]);

  useEffect(() => {
    fetchConfig();
  }, []);


  const fetchConfig = async () => {
    const configRef = doc(db, "config", 'website');
    const configDoc = await getDoc(configRef);
    if (configDoc.exists()) {
      setHarvest(configDoc.data());
    }
  };

  const checkPendingTransaction = () => {
    const storedTxHash = localStorage.getItem('pendingTransactionHash');
    if (!storedTxHash || !library) return;

    library.getTransactionReceipt(storedTxHash).then(receipt => {
      if (receipt && receipt.confirmations) {
        updateAccountPaidStatus(storedTxHash);
      }
      localStorage.removeItem('pendingTransactionHash');
    });
  };

  useEffect(() => {
    if (account && state.status === 'Success') {
      updateAccountPaidStatus(state.transaction?.hash);
    }
  }, [state, account]);

  const updateAccountPaidStatus = (transactionHash?: string) => {
    if (!transactionHash || !account) return
    const accountRef = doc(db, "accounts", account.toLowerCase());
    setDoc(accountRef, { account: account.toLowerCase(), tipped: true, transactionHash }, { merge: true });
  };

  const isAllowedNetwork = () => ALLOWED_NETWORKS.includes(chainId || 1);

  const handleDonate = (amount: string) => {
    if (!account || !isAllowedNetwork()) return;

    sendTransaction({ to: WOJAK_JONES_FARM_ADDRESS, value: ethers.utils.parseEther(amount) })
      .then((txResponse) => {
        localStorage.setItem('pendingTransactionHash', txResponse?.transactionHash || '');
      })
      .catch(console.error);
  };

  const getBlockExplorerUrl = (txHash: string = '', chainId: number = 1): string => {
    switch (chainId) {
      case Optimism.chainId:
        return Optimism.getExplorerTransactionLink(txHash);
      case Polygon.chainId:
        return Polygon.getExplorerTransactionLink(txHash);
      case Arbitrum.chainId:
        return Arbitrum.getExplorerTransactionLink(txHash);
      default:
        return Mainnet.getExplorerTransactionLink(txHash);
    }
  }

  const renderTransactionState = () => {
    switch (state.status) {
      case 'None':
        return <div className="font-farmerr text-2xl text-center"></div>
      case 'PendingSignature':
        return <div className="font-farmerr  animate animate-pulse text-2xl text-center py-2 my-2 border-y border-gray-600 bg-theme-3">Awaiting Signature...</div>;
      case 'Mining':
        return <div className="font-farmerr  animate animate-pulse text-2xl text-center py-2 my-2 border-y border-gray-600 bg-theme-3">Transaction being processed.<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      case 'Success':
        return <div className="font-farmerr  text-2xl text-center py-2 my-2 border-y border-gray-600 bg-theme-3">Well look at that, transaction successful!<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      case 'Fail':
        return <div className="font-farmerr  text-2xl text-center py-2 my-2 border-y border-gray-600 bg-theme-3">Ah sorry, partner - the transaction failed.<br></br><a target='_blank' href={getBlockExplorerUrl(state?.transaction?.hash, chainId)}>View Explorer</a></div>;
      default:
        return <div className="font-farmerr   text-2xl text-center"></div>;
    }
  };

  return (
    <div className='mx-auto max-w-4xl  min-h-full mb-32 text-gray-900  rounded-sm mt-16  justify-center '>
      <>
        <div className="bg-theme-4 border-2 border-gray-600 justify-center mx-auto pb-10   rounded-sm max-w-4xl py-4  pt-8">
          <h1 className="text-7xl font-bold mb-2 pt-4 text-center ">Wojak Jones Farm</h1>
          <img src='./field.png' alt='logo' className='h-16 w-16 justify-center text-center mx-auto'></img>
          <h1 className="text-5xl font-bold mb-2 pt-4 text-center ">Front Gate</h1>
          <p className='text-2xl text-center'>Welcome {account && 'back'} to Wojak Jones Farm, partner.</p>
          {!account && <p className='text-2xl text-center pb-2'>Connect your wallet to view our crops.</p>}
          {account && harvest && <p className='text-2xl text-center pb-2'>We're currently on harvest {harvest?.harvest}, and if you care to stay<br></br> we will be sending the combine harvester out on {harvest?.nextHarvest.toDate().toDateString()}</p>}
          <div className='justify-center mx-auto text-center pt-2'>
            <ConnectButton />

            <button onClick={() => setOpen(true)} className="border-2 ml-3 border-gray-600 text-2xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
              $CROPS
            </button>


            <a href='https://t.me/wojakjonesfarm' target='_blank' onClick={() => setOpen(true)} className="border-2 ml-3 border-gray-600 text-2xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
              Telegram
            </a>
            <button onClick={() => setOpenTip(true)} className="border-2 ml-3 border-gray-600 text-2xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
              Tip Farm
            </button>
          </div>

          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0  transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-theme-4 px-4 pb-4 pt-5 text-left shadow-xl border-2 border-gray-600 transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div>

                        <div className=" text-center ">
                          <Dialog.Title as="h3" className="text-5xl font-farmerr  font-semibold  text-gray-900">
                            THERE'S $CROPS TRADING OUT UNISWAP WAY
                          </Dialog.Title>
                          <div className="mt-4 text-center">
                            <p className='text-2xl font-farmerr'>We've heard that there are a network of farmers swapping their CROPS on-chain, take your tractor and see what you can negotiate.</p>
                            {account && state.status && <span >

                            </span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 grid grid-cols-3 font-farmerr justify-evenly flex align-middle">
                        {harvest && <> <a href={`https://app.uniswap.org/swap?outputCurrency=${harvest.cropContract}&inputCurrency=ETH`} target='_blank' className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 text-center ">
                          Uniswap
                        </a>
                          <a href={`https://www.geckoterminal.com/eth/pools/${harvest.cropLiquidityPool}`} target='_blank' className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 text-center ">
                            Chart
                          </a></>}

                        <button onClick={() => {
                          setOpen(false)
                        }} className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 text-center ">
                          Close
                        </button>


                      </div>


                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          <Transition.Root show={openTip} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpenTip}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0  transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-theme-4 px-4 pb-4 pt-5 text-left shadow-xl border-2 border-gray-600 transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div>

                        <div className=" text-center ">
                          <Dialog.Title as="h3" className="text-5xl font-farmerr  font-semibold  text-gray-900">
                            Thanks for the tip, partner.
                          </Dialog.Title>
                          <div className="mt-4 text-center">
                            <p className='text-2xl font-farmerr'>Everything goes to helping construct new buildings on the farmyard and researching new ways to uncover rarer, higher yielding crops.</p>
                            {account && state.status && <span >
                              {renderTransactionState()}
                            </span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 grid grid-cols-3 font-farmerr">
                        <button onClick={() => handleDonate('0.05')} className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
                          0.01 ETH
                        </button>
                        <button onClick={() => handleDonate('0.10')} className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
                          0.05 ETH
                        </button>
                        <button onClick={() => handleDonate('0.10')} className="border-2 ml-3 border-gray-600 text-3xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto">
                          0.10 ETH
                        </button>
                      </div>

                      <div className="mt-4 sm:mt-4 grid grid-cols-3 font-farmerr">
                        <div></div>
                        <button onClick={() => {
                          setOpenTip(false)
                        }} className="border-2  border-gray-600 text-3xl w-full px-2 rounded-sm bg-theme-1 hover:bg-theme-3 justify-center text-center inline-flex mx-auto">
                          Close
                        </button>
                        <div></div>
                      </div>

                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </>


      <div className='justify-center mx-auto text-center border-t-2 border-x-2 border-gray-600 mt-6 bg-theme-5 '>

        <button
          onClick={() => setCurrentPage('Crop Fields')}
          className={`mt-4 mb-4 border-2 border-gray-600 mr-3 text-2xl px-2 rounded-sm ${currentPage === 'Crop Fields' ? 'bg-theme-4' : 'bg-theme-1'} hover:bg-theme-4 justify-center text-center inline-flex mx-auto`}
        >
          Crop Fields
        </button>
        <button
          onClick={() => setCurrentPage('Storage')}
          className={`mt-4 mb-4 border-2 border-gray-600 mr-3 text-2xl px-2 rounded-sm ${currentPage === 'Storage' ? 'bg-theme-4' : 'bg-theme-1'} hover:bg-theme-4 justify-center text-center inline-flex mx-auto`}
        >
          Storage
        </button>
        <button
          onClick={() => setCurrentPage('Harvest')}
          className={`mt-4 mb-4 border-2 border-gray-600 text-2xl px-2 rounded-sm ${currentPage === 'Harvest' ? 'bg-theme-4' : 'bg-theme-1'} hover:bg-theme-4 justify-center text-center inline-flex mx-auto`}
        >
          Harvests
        </button>
      </div>
      <>
        {currentPage === 'Crop Fields' ? (
          <Farmyard harvest={harvest} dbCollection='activeFarms'></Farmyard>
        ) : currentPage === 'Storage' ? (
          <Farmyard harvest={harvest} dbCollection='archivedFarms'></Farmyard>) : (
          <Harvest harvest={harvest}></Harvest>
        )}

      </>
      <div className="bg-theme-4 border-b-2 border-x-2 border-gray-600 mx-auto flex justify-evenly  rounded-b-sm max-w-4xl py-4  pt-4">


        <a target='_blank' href='https://twitter.com/galleonlabs' className='text-2xl text-center inline-flex border-b hover:border-b-gray-600 border-transparent'>Twitter</a>
        <a target='_blank' href='https://twitter.com/andrew_eth' className='text-2xl text-center inline-flex border-b hover:border-b-gray-600 border-transparent'>Head Farmer</a>
        <a target='_blank' href='https://galleonlabs.io' className='text-2xl text-center inline-flex border-b hover:border-b-gray-600 border-transparent'>Galleon Labs</a>
        <a target='_blank' href='https://github.com/galleonlabs' className='text-2xl text-center inline-flex border-b hover:border-b-gray-600 border-transparent'>GitHub</a>
      </div>
    </div>
  )
}

export default App
