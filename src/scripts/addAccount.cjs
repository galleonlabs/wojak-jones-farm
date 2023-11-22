const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//   {
//     account: "0x...".toLowerCase(),
//     paid: false,
//   },

const accountData = [];

const batch = db.batch();

accountData.forEach((account) => {
  const accountRef = db.collection("accounts").doc(account.account);
  batch.set(accountRef, account);
});

batch
  .commit()
  .then(() => {
    console.log("Successfully added accounts to Firestore.");
  })
  .catch((error) => {
    console.error("Error adding accounts to Firestore: ", error);
  });
