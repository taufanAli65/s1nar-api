const admin = require("firebase-admin");
const db = admin.firestore();

async function getOrganisasiById(id) {
  const doc = await db.collection("organisasi").doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    nama: data.nama,
    fotoProfile: data.fotoProfile || null,
  };
}

module.exports = { getOrganisasiById };
