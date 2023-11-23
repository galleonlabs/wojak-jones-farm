const admin = require("firebase-admin");
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const moveFarm = async (sourceCollection, targetCollection, docId) => {
  const sourceRef = db.collection(sourceCollection).doc(docId);
  const targetRef = db.collection(targetCollection).doc(docId);

  const doc = await sourceRef.get();
  if (!doc.exists) {
    console.log(`Document with ID ${docId} does not exist in ${sourceCollection}`);
    return;
  }

  await targetRef.set(doc.data());
  await sourceRef.delete();

  console.log(`Document ${docId} moved from ${sourceCollection} to ${targetCollection}`);
};

// Example Usage:
// moveFarm("activeFarms", "archivedFarms", "yourDocumentIdHere");
// moveFarm("archivedFarms", "activeFarms", "yourDocumentIdHere");
