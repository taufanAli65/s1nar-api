const admin = require("firebase-admin");
const db = admin.firestore();

async function tambahCrowdfund(narasiId, organisasiId, jumlah, isInitial = false, userId = null) {
  // Simpan transaksi pembayaran ke narasi
  const pembayaranRef = db.collection("pembayaran").doc();
  await pembayaranRef.set({
    narasiId,
    organisasiId,
    jumlah,
    tanggal: admin.firestore.FieldValue.serverTimestamp(),
    isInitial,
    userId: userId || null,
    tipe: "narasi"
  });

  // Update total crowdfund di narasi
  const narasiRef = db.collection("narasi").doc(narasiId);
  await db.runTransaction(async (t) => {
    const narasiDoc = await t.get(narasiRef);
    if (!narasiDoc.exists) throw new Error("Narasi tidak ditemukan");
    const prev = narasiDoc.data().crowdfund || 0;
    t.update(narasiRef, { crowdfund: prev + jumlah });
  });

  return { narasiId, organisasiId, jumlah, isInitial, userId, tipe: "narasi" };
}

async function tambahCrowdfundOrganisasi(organisasiId, jumlah, userId = null) {
  // Simpan transaksi pembayaran ke organisasi
  const pembayaranRef = db.collection("pembayaran").doc();
  await pembayaranRef.set({
    organisasiId,
    jumlah,
    tanggal: admin.firestore.FieldValue.serverTimestamp(),
    userId: userId || null,
    tipe: "organisasi"
  });

  // Update total crowdfund di organisasi
  const orgRef = db.collection("organisasi").doc(organisasiId);
  await db.runTransaction(async (t) => {
    const orgDoc = await t.get(orgRef);
    if (!orgDoc.exists) throw new Error("Organisasi tidak ditemukan");
    const prev = orgDoc.data().crowdfund || 0;
    t.update(orgRef, { crowdfund: prev + jumlah });
  });

  return { organisasiId, jumlah, userId, tipe: "organisasi" };
}

async function getPembayaranByNarasi(narasiId) {
  const snapshot = await db.collection("pembayaran").where("narasiId", "==", narasiId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getPembayaranByOrganisasi(organisasiId) {
  const snapshot = await db.collection("pembayaran")
    .where("organisasiId", "==", organisasiId)
    .where("tipe", "==", "organisasi")
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  tambahCrowdfund,
  tambahCrowdfundOrganisasi,
  getPembayaranByNarasi,
  getPembayaranByOrganisasi,
};
