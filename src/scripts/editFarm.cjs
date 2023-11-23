const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const editFarm = async (collectionName, docId, newData) => {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.set(newData, { merge: true });
  console.log(`Document ${docId} in ${collectionName} has been updated.`);
};

// Example Usage:
// editFarm("activeFarms", "yourDocumentIdHere", { riskScore: 4 });
