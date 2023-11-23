const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const moveFarmsToArchive = async () => {
  const activeFarmsRef = db.collection("activeFarms");
  const activeFarmsSnapshot = await activeFarmsRef.get();
  const batch = db.batch();

  activeFarmsSnapshot.forEach((doc) => {
    const archivedFarmRef = db.collection("archivedFarms").doc(doc.id);
    batch.set(archivedFarmRef, doc.data());
    batch.delete(activeFarmsRef.doc(doc.id));
  });

  await batch.commit();
  console.log("Farms successfully moved to archivedFarms.");
};

moveFarmsToArchive();
