const admin = require("firebase-admin");
const db = admin.firestore();

async function tambahCrowdfund(narasiId, organisasiId, jumlah, isInitial = false) {
  // Simpan transaksi pembayaran
  const pembayaranRef = db.collection("pembayaran").doc();
  await pembayaranRef.set({
    narasiId,
    organisasiId,
    jumlah,
    tanggal: admin.firestore.FieldValue.serverTimestamp(),
    isInitial,
  });

  // Update total crowdfund di narasi
  const narasiRef = db.collection("narasi").doc(narasiId);
  await db.runTransaction(async (t) => {
    const narasiDoc = await t.get(narasiRef);
    if (!narasiDoc.exists) throw new Error("Narasi tidak ditemukan");
    const prev = narasiDoc.data().crowdfund || 0;
    t.update(narasiRef, { crowdfund: prev + jumlah });
  });

  return { narasiId, organisasiId, jumlah, isInitial };
}

async function getPembayaranByNarasi(narasiId) {
  const snapshot = await db.collection("pembayaran").where("narasiId", "==", narasiId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { tambahCrowdfund, getPembayaranByNarasi };
