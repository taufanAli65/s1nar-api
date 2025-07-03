const admin = require("firebase-admin");
const db = admin.firestore();

async function isFirstNarasiForOrganisasi(organisasiId) {
  const snapshot = await db.collection("narasi").where("id_organisasi", "==", organisasiId).get();
  return snapshot.empty;
}

module.exports = { isFirstNarasiForOrganisasi };
