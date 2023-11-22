import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { DocumentData, collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../main";
import useSignText from "../hooks/useSignText";

interface RewardAsset {
  name: string;
  ticker: string;
  coinGeckoUrl: string;
}

interface Farm {
  farmName: string;
  farmLink: string;
  rewardAssets: RewardAsset[];
  riskScore: number;
  type: string;
  network: string;
}

const Farmyard = () => {
  const { account } = useEthers();
  const signText = useSignText();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(Boolean(localStorage.getItem('verified')) || false);

  useEffect(() => {
    if (!account) return;

    const verifyUser = async () => {
      const isVerified = localStorage.getItem('verified') === 'true';

      if (!isVerified) {
        try {
          await signText('Please sign this message to verify your wallet.');
          localStorage.setItem('verified', 'true');
          setVerified(true)
          return true;
        } catch (error) {
          console.error('Error in signing message:', error);
          setVerified(false)
          return false;
        }
      } else if (isVerified) {
        setVerified(isVerified)
        return true
      }
    };

    const checkAccountPaidStatus = async () => {
      const accountRef = doc(db, "accounts", account.toLowerCase());
      const accountDoc = await getDoc(accountRef);

      if (accountDoc.exists()) {
        setHasPaid(accountDoc.data().paid);
        return accountDoc.data().paid;
      } else {
        setHasPaid(false);
        return false;
      }
    };

    const fetchActiveFarms = async () => {
      const q = query(collection(db, "activeFarms"));
      const querySnapshot = await getDocs(q);
      const fetchedFarms: Farm[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedFarms.push(doc.data() as Farm);
      });
      setFarms(fetchedFarms);
    };

    const fetchData = async () => {
      const verified = await verifyUser();
      console.log(verified);

      if (!verified) return;

      const isPaid = await checkAccountPaidStatus();
      if (isPaid) {
        fetchActiveFarms();
      } else {
        setFarms([]);
      }
    };

    fetchData();
  }, [account]);

  return (
    <>
      <div className="bg-theme-4 border-2 border-theme-5  rounded-sm max-w-4xl py-8 tracking-wider bg-[url('Frame.png')] bg-contain bg-repeat bg-top">
        <h1 className="text-3xl font-bold text-theme-pan-navy mb-4 text-center ">The Farmyard</h1>
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-8">
          {verified && hasPaid && farms.map((farm: Farm, index: number) => (
            <li key={index} className="col-span-1 divide divide-theme-5 rounded-sm bg-theme-4 border-2 border-theme-5 shadow shadow-theme-5 ">
              <div className="flex w-full items-center justify-between space-x-6 p-4">
                <div className="flex-1">

                  <h3 className="text-md font-semibold truncate  text-gray-900 pb-1 mb-2 border-b border-theme-5">{farm.farmName}</h3>

                  <p>
                    Risk:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-1  text-sm text-gray-900 border border-theme-5">
                      {farm.riskScore}/5
                    </span>
                  </p>
                  <p>
                    Network:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-1  text-sm text-gray-900 border border-theme-5">
                      {farm.network}
                    </span>
                  </p>
                  <p>Rewards: {farm.rewardAssets.map((asset, index) => <a href={asset.coinGeckoUrl} key={index} className="hover:bg-theme-3 inline-flex mx-0.5 flex-shrink-0 items-center rounded-sm  px-1  text-sm text-gray-900 border border-theme-5">
                    {asset.ticker}
                  </a>)}</p>
                  <p>
                    Type:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm  px-1  text-sm text-gray-900 border border-theme-5">
                      {farm.type} Crop
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-theme-5 bg-theme-1 hover:bg-theme-3">
                  <div className="flex w-0 flex-1">
                    <a
                      href={farm.farmLink}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-sm border border-transparent py-1 text-md font-semibold text-gray-900"
                    >
                      Visit farm
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {verified && !hasPaid && <div className="text-red-500">Please pay to view the farms.</div>}
        {!verified && <div>Please verify ownership of your wallet</div>}
      </div>
    </>
  );
};

export default Farmyard;
