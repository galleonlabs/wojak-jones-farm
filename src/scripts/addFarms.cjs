const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const { Arbitrum, Optimism } = require("@usedapp/core");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const VOLATILE = "VOLATILE";
const STABLE = "STABLE";
const STAKING = "STAKING";
const AIRDROP = "AIRDROP";

// {
//     farmName: "[Protocol] [requiredAssets] [Action]",
//     farmLink: "https://wojakjonesfarm.com",
//     rewardAssets: [
//       {
//         name: "",
//         ticker: "",
//         coinGeckoUrl: "",
//       },
//     ],
//     riskScore: 5,
//     type: VOLATILE,
//     network: ''
//   },

const farmData = [];

const batch = db.batch();

farmData.forEach((farm) => {
  const farmRef = db.collection("activeFarms").doc();
  batch.set(farmRef, farm);
});

batch
  .commit()
  .then(() => {
    console.log("Successfully added farms to Firestore.");
  })
  .catch((error) => {
    console.error("Error adding farms to Firestore: ", error);
  });
