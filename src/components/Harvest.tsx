import { useEthers, useTokenBalance } from "@usedapp/core";
import { useEffect, useState } from "react";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../main";
import { displayFromWei } from "./Farmyard";

interface RewardAsset {
  name: string;
  ticker: string;
  coinGeckoUrl: string;
  logo: string;
}

interface CompletedHarvest {
  harvest: number;
  season: string;
  score: number;
  rewardAssets: RewardAsset[];
}

interface HarvestProps {
  harvest: DocumentData | null;
}

const Harvest = ({ harvest }: HarvestProps) => {
  const { account } = useEthers();
  const [completedHarvests, setCompletedHarvests] = useState<CompletedHarvest[]>([]);
  const balance = useTokenBalance("0x62012018d70A7389F329aBc2FE776c4a70E433Af", account, { chainId: 1 })

  const cropBalance = balance && displayFromWei(balance, 2, 18) || "0";
  const enoughCrops = harvest && parseFloat(cropBalance) >= harvest.minimumCrops

  useEffect(() => {
    if (!account) return;

    const fetchCompletedHarvests = async () => {
      const querySnapshot = await getDocs(collection(db, "completedHarvest"));
      const harvestData = querySnapshot.docs.map(doc => doc.data() as CompletedHarvest);
      setCompletedHarvests(harvestData);
    };

    fetchCompletedHarvests();
  }, [account]);

  return (
    <>
      {account && enoughCrops ? (
        <div className="mx-auto bg-theme-4 border-2 border-gray-600 rounded-sm max-w-4xl py-8 tracking-wider">
          <img src='./barn.png' alt='logo' className='h-16 w-16 justify-center text-center mx-auto'></img>
          <h1 className="text-5xl font-bold text-theme-pan-navy mb-2 text-center pt-4">Harvests</h1>
          <p className='text-2xl text-center pb-2'>See here what crops we've previously grown and yielded from the farm.</p>
          <ul>
            {completedHarvests.map((harvest, index) => (
              <li key={index} className="my-2 px-8 mx-8 rounded-sm pb-2 pt-4 border-2 mb-4 border-theme-2 bg-theme-5 shadow-sm shadow-theme-5">
                <h2 className="text-2xl font-bold">{`Harvest #${harvest.harvest} (${harvest.season})`}</h2>
                <div className="flex flex-wrap">
                  {harvest.rewardAssets.map((asset, idx) => (
                    <div key={idx} className="flex items-center my-2 mx-4">
                      <img src={asset.logo} alt={asset.name} className="w-10 h-10 mr-2 grayscale-[40%] rounded-full border-2 border-gray-600 p-0.5 bg-white" />
                      <a href={asset.coinGeckoUrl} target="_blank" rel="noopener noreferrer" className="text-xl hover:underline ">
                        {asset.ticker}
                      </a>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : <></>}
    </>
  );
};

export default Harvest;
