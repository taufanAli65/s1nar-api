const admin = require("firebase-admin");
const db = admin.firestore();

const contentCollection = db.collection("content");

async function updateContentStatus(contentId, status) {
  const contentRef = contentCollection.doc(contentId);
  const contentDoc = await contentRef.get();
  if (!contentDoc.exists) throw new Error("Content tidak ditemukan");

  // Revisi maksimal 3x
  if (status === "revisi") {
    const revisi_count = contentDoc.data().revisi_count || 0;
    if (revisi_count >= 3) throw new Error("Revisi sudah mencapai batas maksimal 3x");
    await contentRef.update({
      status: "revisi",
      revisi_count: revisi_count + 1,
    });
  } else {
    await contentRef.update({ status });
  }
  const updated = await contentRef.get();
  return { id: updated.id, ...updated.data() };
}

module.exports = { updateContentStatus };
