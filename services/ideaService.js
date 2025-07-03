const admin = require("firebase-admin");
const db = admin.firestore();

const ideaCollection = db.collection("idea");
const narasiCollection = db.collection("narasi");
const contentCollection = db.collection("content");
const userCollection = db.collection("user");

async function createIdea({ judul_ide, attachment_file, deskripsi, narasi_id, user_id }) {
  // Pastikan narasi aktif
  const narasiDoc = await narasiCollection.doc(narasi_id).get();
  if (!narasiDoc.exists) throw new Error("Narasi tidak ditemukan");
  if (narasiDoc.data().status !== "active") throw new Error("Tidak bisa menambahkan ide ke narasi non-aktif");

  const docRef = await ideaCollection.add({
    judul_ide,
    attachment_file,
    deskripsi,
    narasi_id,
    user_id,
    status: "pending", // pending, revisi, accepted, rejected
    revisi_count: 0,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: docRef.id, judul_ide, attachment_file, deskripsi, narasi_id, user_id, status: "pending", revisi_count: 0 };
}

async function updateIdeaStatus(ideaId, status) {
  const ideaRef = ideaCollection.doc(ideaId);
  const ideaDoc = await ideaRef.get();
  if (!ideaDoc.exists) throw new Error("Idea tidak ditemukan");

  // Jika revisi, cek revisi_count
  if (status === "revisi") {
    const revisi_count = ideaDoc.data().revisi_count || 0;
    if (revisi_count >= 3) throw new Error("Revisi sudah mencapai batas maksimal 3x");
    await ideaRef.update({
      status: "revisi",
      revisi_count: revisi_count + 1,
    });
  } else {
    await ideaRef.update({ status });
  }
  const updated = await ideaRef.get();
  return { id: updated.id, ...updated.data() };
}

async function getIdeaById(ideaId) {
  const doc = await ideaCollection.doc(ideaId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getIdeasByNarasi(narasi_id) {
  const snapshot = await ideaCollection.where("narasi_id", "==", narasi_id).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getIdeasByUser(user_id) {
  const snapshot = await ideaCollection.where("user_id", "==", user_id).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getIdeasByOrganisasi(organisasi_id) {
  // Ambil narasi milik organisasi
  const narasiSnap = await narasiCollection.where("id_organisasi", "==", organisasi_id).get();
  const narasiIds = narasiSnap.docs.map(doc => doc.id);
  if (narasiIds.length === 0) return [];
  const ideas = [];
  for (const narasi_id of narasiIds) {
    const ideaSnap = await ideaCollection.where("narasi_id", "==", narasi_id).get();
    ideas.push(...ideaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  return ideas;
}

async function getIdeasByKategori(kategory_konten) {
  // Ambil narasi dengan kategori tertentu dan status active
  const narasiSnap = await narasiCollection
    .where("kategory_konten", "==", kategory_konten)
    .where("status", "==", "active")
    .get();
  const narasiIds = narasiSnap.docs.map(doc => doc.id);
  if (narasiIds.length === 0) return [];
  const ideas = [];
  for (const narasi_id of narasiIds) {
    const ideaSnap = await ideaCollection.where("narasi_id", "==", narasi_id).get();
    ideas.push(...ideaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  return ideas;
}

// ACC idea: pindahkan ke koleksi content, update saldo user
async function accIdea(ideaId) {
  const idea = await getIdeaById(ideaId);
  if (!idea) throw new Error("Idea tidak ditemukan");
  if (idea.status === "accepted") throw new Error("Idea sudah di-ACC");

  // Ambil narasi
  const narasiDoc = await narasiCollection.doc(idea.narasi_id).get();
  if (!narasiDoc.exists) throw new Error("Narasi tidak ditemukan");
  const narasi = narasiDoc.data();

  // Tentukan budget sesuai kategori
  const kategori = narasi.kategory_konten;
  const budgetField = `budget-${kategori}`;
  const saldo = narasi[budgetField] || 0;

  // Tambahkan ke koleksi content
  await contentCollection.add({
    ...idea,
    narasi: narasi,
    status: "active",
    acc_at: admin.firestore.FieldValue.serverTimestamp(),
    revisi_count: idea.revisi_count || 0,
  });

  // Update status idea jadi accepted
  await ideaCollection.doc(ideaId).update({ status: "accepted" });

  // Tambahkan saldo ke user
  const userRef = userCollection.doc(idea.user_id);
  await db.runTransaction(async (t) => {
    const userDoc = await t.get(userRef);
    const prev = userDoc.exists && userDoc.data().saldo ? userDoc.data().saldo : 0;
    t.set(userRef, { saldo: prev + saldo }, { merge: true });
  });

  return { ...idea, status: "accepted", saldo_diterima: saldo };
}

module.exports = {
  createIdea,
  updateIdeaStatus,
  getIdeaById,
  getIdeasByNarasi,
  getIdeasByUser,
  getIdeasByOrganisasi,
  getIdeasByKategori,
  accIdea,
};
