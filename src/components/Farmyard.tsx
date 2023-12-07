import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useState } from "react";
import { DocumentData, collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../main";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

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

interface FarmyardProps {
  harvest: DocumentData | null;
  dbCollection: string
}

export const displayFromWei = (
  number: BigNumber,
  decimals: number = 0,
  power: number = 18
): string | null => {
  if (!number) return null;

  if (decimals) {
    return Number(formatUnits(number, power)).toFixed(decimals);
  }

  return formatUnits(number, power);
};

const Farmyard = ({ harvest, dbCollection }: FarmyardProps) => {
  const { account } = useEthers();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Farms');
  const balance = useTokenBalance("0x62012018d70A7389F329aBc2FE776c4a70E433Af", account, { chainId: 1 })

  const cropBalance = balance && displayFromWei(balance, 2, 18) || "0";
  const enoughCrops = harvest && parseFloat(cropBalance) >= harvest.minimumCrops

  useEffect(() => {
    if (!account) return;

    const fetchActiveFarms = async (fetchCount: number = 2) => {
      const farmsQuery = query(collection(db, dbCollection), limit(fetchCount));
      const querySnapshot = await getDocs(farmsQuery);
      const fetchedFarms: Farm[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedFarms.push(doc.data() as Farm);
      });
      setFarms(fetchedFarms);
    };

    const fetchData = async () => {
      fetchActiveFarms(enoughCrops ? 100 : 2);
    };

    fetchData();
  }, [account, enoughCrops, dbCollection]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredFarms = farms.filter(farm => {
    return selectedFilter === 'All Farms' || farm.type === selectedFilter.toUpperCase();
  });


  return (
    <>
      <div className="mx-auto bg-theme-4  border-2 border-gray-600  rounded-sm max-w-4xl py-8 tracking-wider bg-[url('Frame.png')] bg-contain bg-repeat bg-top">
        <img src='./farm.png' alt='logo' className='h-16 w-16 justify-center text-center mx-auto'></img>
        <h1 className="text-5xl font-bold text-theme-pan-navy mb-2 text-center pt-4">{dbCollection === 'activeFarms' ? 'Crop Fields' : 'Storage'}</h1>
        {account && harvest && dbCollection === 'archivedFarms' && <p className='text-2xl text-center pb-2'>Historic crops on the farm, we still keep a few seeds around.</p>}
        {account && harvest && dbCollection === 'activeFarms' && <p className='text-2xl text-center pb-2'>Our current {harvest?.season} harvest</p>}
        {account && !enoughCrops && <div className="text-2xl text-center mx-auto border-gray-900 bg-theme-3 py-4 border-y mb-2">Labourers with at least {harvest?.minimumCrops} $CROPS get access to the full farmyard.</div>}


        {account && enoughCrops && <div className="text-center mb-2">
          {['All Farms', 'Stable', 'Volatile', 'Staking', 'Airdrop'].map(filter => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`mx-2 px-2 text-2xl border-2 border-gray-600 rounded-sm ${selectedFilter === filter ? 'bg-theme-3' : 'bg-theme-1'}`}
            >
              {filter}
            </button>
          ))}
        </div>}

        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mx-8 pt-4">
          {account && filteredFarms.map((farm: Farm, index: number) => (
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
          {(!enoughCrops || !account) && <>
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
            </div>, 0, 4).map((x, index) => <div key={index}>{x}</div>)
            }
          </>
          }
        </ul>
      </div>
    </>
  );
};

export default Farmyard;
