import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { DocumentData, collection, doc, getDoc, getDocs, limit, query } from "firebase/firestore";
import { db } from "../main";

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
  const [farms, setFarms] = useState<Farm[]>([]);
  const [hasPaid, setHasPaid] = useState<boolean>(false);

  useEffect(() => {
    if (!account) return;

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

    const fetchActiveFarms = async (fetchCount: number = 2) => {
      const farmsQuery = query(collection(db, "activeFarms"), limit(fetchCount));
      const querySnapshot = await getDocs(farmsQuery);
      const fetchedFarms: Farm[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedFarms.push(doc.data() as Farm);
      });
      setFarms(fetchedFarms);
    };

    const fetchData = async () => {
      const isPaid = await checkAccountPaidStatus();
      if (isPaid) {
        fetchActiveFarms(100);
      } else {
        fetchActiveFarms();
      }
    };

    fetchData();
  }, [account]);

  return (
    <>
      <div className="mx-auto bg-theme-4 border-2 border-theme-5  rounded-sm max-w-4xl py-8 tracking-wider bg-[url('Frame.png')] bg-contain bg-repeat bg-top">
        <img src='./farm.png' alt='logo' className='h-16 w-16 justify-center text-center mx-auto'></img>
        <h1 className="text-5xl font-bold text-theme-pan-navy mb-2 text-center pt-4">The Farmyard</h1>
        {account && !hasPaid && <div className="text-2xl text-center mx-auto border-gray-900 bg-theme-3 py-4 border-y mb-2 mt-4">Consider a one-time donation to the farmstead to see more than two crops, friend.</div>}
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mx-8 pt-4">
          {account && farms.map((farm: Farm, index: number) => (
            <li key={index} className="col-span-1 divide divide-theme-5 rounded-sm bg-theme-4 border-2 border-theme-5 shadow shadow-theme-5 ">
              <div className="flex w-full items-center justify-between space-x-6 p-4">
                <div className="flex-1 text-xl">

                  <h3 className="text-2xl font-semibold truncate  text-gray-900 pb-1 mb-2 border-b border-theme-5">{farm.farmName}</h3>

                  <p className="py-0.5">
                    Risk:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-2  text-xl text-gray-900">
                      {farm.riskScore}/5
                    </span>
                  </p>
                  <p className="py-0.5">
                    Network:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-2  text-xl text-gray-900">
                      {farm.network}
                    </span>
                  </p>
                  <p className="py-0.5">Rewards: {farm.rewardAssets.map((asset, index) => <a href={asset.coinGeckoUrl} target="_blank" key={index} className="hover:bg-theme-1 bg-theme-3 inline-flex mx-0.5 flex-shrink-0 items-center rounded-sm  px-2  text-xl text-gray-900 border border-gray-600">
                    {asset.ticker}
                  </a>)}</p>
                  <p className="pt-0.5">
                    Type:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm  px-2  text-xl text-gray-900 ">
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
                      target="_blank"
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-sm border border-transparent py-1 text-2xl font-semibold text-gray-900"
                    >
                      Inspect crop
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {!hasPaid && <>
            {[<></>, <></>, <></>, <></>].fill(<div className=" blur col-span-1 divide divide-theme-5 rounded-sm bg-theme-4 border-2 border-theme-5 shadow shadow-theme-5 ">
              <div className="flex w-full items-center justify-between space-x-6 p-4">
                <div className="flex-1 text-xl">

                  <h3 className="text-2xl font-semibold truncate  text-gray-900 pb-1 mb-2 border-b border-theme-5">Glorious Farm</h3>

                  <p className="py-0.5">
                    Risk:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-2  text-xl text-gray-900">
                      2/5
                    </span>
                  </p>
                  <p className="py-0.5">
                    Network:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm px-2  text-xl text-gray-900">
                      Ethereum
                    </span>
                  </p>
                  <p className="py-0.5">Rewards: <span className="hover:bg-theme-1 bg-theme-3 inline-flex mx-0.5 flex-shrink-0 items-center rounded-sm  px-2  text-xl text-gray-900 border border-gray-600">
                    BCF</span>
                  </p>
                  <p className="pt-0.5">
                    Type:&nbsp;
                    <span className="ml-0.5 inline-flex flex-shrink-0 items-center rounded-sm  px-2  text-xl text-gray-900 ">
                      Volatile Crop
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-theme-5 bg-theme-1 hover:bg-theme-3">
                  <div className="flex w-0 flex-1">
                    <span
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-sm border border-transparent py-1 text-2xl font-semibold text-gray-900"
                    >
                      Inspect crop
                    </span>
                  </div>
                </div>
              </div>
            </div>, 0, 4).map(x => <>{x}</>)
            }
          </>
          }
        </ul>
      </div>
    </>
  );
};

export default Farmyard;
