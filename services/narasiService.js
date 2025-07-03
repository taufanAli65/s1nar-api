const admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection("narasi");

async function createNarasi({
  judul,
  deskripsi,
  id_organisasi,
  fotoUrl,
  expired_at,
  status,
  kategory_konten,
  budget_infografis,
  budget_poster,
  budget_video,
  budget_meme,
  budget_gambar,
}) {
  // Pastikan status hanya "active" atau "non-active"
  const allowedStatus = ["active", "non-active"];
  const safeStatus = allowedStatus.includes(status) ? status : "active";
  const docRef = await collection.add({
    judul,
    deskripsi,
    id_organisasi,
    fotoUrl,
    expired_at,
    status: safeStatus,
    kategory_konten,
    "budget-infografis": budget_infografis || 0,
    "budget-poster": budget_poster || 0,
    "budget-video": budget_video || 0,
    "budget-meme": budget_meme || 0,
    "budget-gambar": budget_gambar || 0,
  });
  return {
    id: docRef.id,
    judul,
    deskripsi,
    id_organisasi,
    fotoUrl,
    expired_at,
    status: safeStatus,
    kategory_konten,
    "budget-infografis": budget_infografis || 0,
    "budget-poster": budget_poster || 0,
    "budget-video": budget_video || 0,
    "budget-meme": budget_meme || 0,
    "budget-gambar": budget_gambar || 0,
  };
}

async function getNarasiById(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateNarasi(id, data) {
  // Pastikan status hanya "active" atau "non-active" jika ada update status
  if (data.status) {
    const allowedStatus = ["active", "non-active"];
    data.status = allowedStatus.includes(data.status) ? data.status : "active";
  }
  await collection.doc(id).update(data);
  return getNarasiById(id);
}

async function deleteNarasi(id) {
  await collection.doc(id).delete();
  return { id };
}

// Pagination, search, and status filter
async function getNarasiList({ page = 1, limit = 10, status, search }) {
  let query = collection;
  if (status) {
    // Filter hanya jika status valid
    const allowedStatus = ["active", "non-active"];
    if (allowedStatus.includes(status)) {
      query = query.where("status", "==", status);
    }
  }
  // Pagination
  const offset = (page - 1) * limit;
  const snapshot = await query.offset(offset).limit(limit).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  createNarasi,
  getNarasiById,
  updateNarasi,
  deleteNarasi,
  getNarasiList,
};
