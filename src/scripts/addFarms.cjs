const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const farmData = [
  {
    farmName: "[Protocol] [requiredAssets] [Action]",
    farmLink: "https://blockcropfarm.com",
    requiredAssets: [
      {
        name: "",
        ticker: "",
        coinGeckoUrl: "",
      },
      {
        name: "",
        ticker: "",
        coinGeckoUrl: "",
      },
    ],
    rewardAssets: [
      {
        name: "",
        ticker: "",
        coinGeckoUrl: "",
      },
    ],
    riskScore: 5,
    notes: "We like the coins",
  },
];

const batch = db.batch();

farmData.forEach((farm) => {
  const farmRef = db.collection("farms").doc();
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
