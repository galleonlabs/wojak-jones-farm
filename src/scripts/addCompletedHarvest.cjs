const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const { Arbitrum, Optimism } = require("@usedapp/core");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const WINTER = 'WINTER'
const SPRING = 'SPRING'
const SUMMER = 'SUMMER'
const AUTUMN = 'AUTUMN'

const db = admin.firestore();

//  {
//     harvest: 1,
//     season: WINTER,
//     score: 3,
//     summary: '',
//     rewardAssets: [
//       {
//         name: "Arbitrum",
//         ticker: "ARB",
//         coinGeckoUrl: "https://www.coingecko.com/en/coins/arbitrum",
//         logo: "https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg",
//       },
//       {
//         name: "Premia",
//         ticker: "PREMIA",
//         coinGeckoUrl: "https://www.coingecko.com/en/coins/premia",
//         logo: "https://assets.coingecko.com/coins/images/13962/standard/apple-touch-icon.png",
//       },
//     ],
//   }

const harvestData = [
  {
    harvest: 1,
    season: WINTER,
    score: 3,
    rewardAssets: [
      {
        name: "Arbitrum",
        ticker: "ARB",
        coinGeckoUrl: "https://www.coingecko.com/en/coins/arbitrum",
        logo: "https://assets.coingecko.com/coins/images/16547/standard/photo_2023-03-29_21.47.00.jpeg",
      },
      {
        name: "Premia",
        ticker: "PREMIA",
        coinGeckoUrl: "https://www.coingecko.com/en/coins/premia",
        logo: "https://assets.coingecko.com/coins/images/13962/standard/apple-touch-icon.png",
      },
    ],
  },
];

const batch = db.batch();

harvestData.forEach((farm) => {
  const farmRef = db.collection("completedHarvest").doc();
  batch.set(farmRef, farm);
});

batch
  .commit()
  .then(() => {
    console.log("Successfully added completedHarvest to Firestore.");
  })
  .catch((error) => {
    console.error("Error adding completedHarvest to Firestore: ", error);
  });
