const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const listFarms = async (collectionName) => {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();
  snapshot.forEach((doc) => {
    console.log(`${doc.id}: ${doc.data().farmName}`);
  });
};

listFarms("activeFarms"); // Replace with "archivedFarms" to list archived farms
