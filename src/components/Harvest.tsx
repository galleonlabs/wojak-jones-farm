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

interface HarvestProps {
  harvest: DocumentData | null;
}

const Harvest = ({ harvest }: HarvestProps) => {
  const { account } = useEthers();
  const balance = useTokenBalance("0x62012018d70A7389F329aBc2FE776c4a70E433Af", account, { chainId: 1 })
  const [uniqueAssets, setUniqueAssets] = useState<RewardAsset[]>([]);
  const cropBalance = balance && displayFromWei(balance, 2, 18) || "0";
  const enoughCrops = harvest && parseFloat(cropBalance) >= harvest.minimumCrops

  useEffect(() => {
    if (!account) return;

    const fetchCompletedHarvests = async () => {
      const querySnapshot = await getDocs(collection(db, "completedHarvest"));
      const assetMap = new Map<string, RewardAsset>();

      querySnapshot.docs.forEach(doc => {
        const harvestData = doc.data() as { rewardAssets: RewardAsset[] };
        harvestData.rewardAssets.forEach(asset => {
          if (!assetMap.has(asset.ticker)) {
            assetMap.set(asset.ticker, asset);
          }
        });
      });

      setUniqueAssets(Array.from(assetMap.values()));
    };

    fetchCompletedHarvests();
  }, [account]);

  return (
    <div >
      {account ? (
        <div className="mx-auto bg-theme-4 border-2 border-gray-600 rounded-sm max-w-4xl py-8 tracking-wider">
          <img src='./barn.png' alt='logo' className='h-16 w-16 justify-center text-center mx-auto'></img>
          <h1 className="text-5xl font-bold text-theme-pan-navy mb-2 text-center pt-4">Harvests</h1>
          <p className='text-2xl text-center pb-4'>Unique crops previously grown and yielded from the farm:</p>
          {account && !enoughCrops && <div className="text-2xl text-center mx-auto border-gray-600 bg-theme-3 py-4 border-y-2 mb-6">Labourers with at least {harvest?.minimumCrops} $CROPS get access to the full farmyard.</div>}
          <div className={`my-1 px-8 mx-8 rounded-sm pb-3 pt-3 border-2 mb-4 ${enoughCrops ? '' : 'blur'} border-theme-2 bg-theme-1 shadow-sm shadow-theme-5 flex flex-wrap`}>
            
            {uniqueAssets.map((asset, idx) => (
              <div key={idx} className="flex items-center mx-4 my-2">
                <img src={asset.logo} alt={asset.name} className="w-12 h-12 mr-2 grayscale-[40%] rounded-full border-2 border-gray-600 p-0.5 bg-white" />
                <a href={asset.coinGeckoUrl} target="_blank" rel="noopener noreferrer" className="text-xl hover:underline ">
                  {asset.ticker}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : <>
         
        </>
      }
    </div >
  );
};

export default Harvest;
