const pembayaranService = require("../services/pembayaranService");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.topUpSaldo = async (req, res) => {
  try {
    const { userId, jumlah } = req.body;
    if (!userId || !jumlah) {
      return res.status(400).json({ error: "userId dan jumlah wajib diisi" });
    }
    const userRef = db.collection("user").doc(userId);
    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) throw new Error("User tidak ditemukan");
      const prev = userDoc.data().saldo || 0;
      t.update(userRef, { saldo: prev + Number(jumlah) });
    });
    res.json({ message: "Top up berhasil", userId, jumlah: Number(jumlah) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tambahCrowdfund = async (req, res) => {
  try {
    const { narasiId, organisasiId, jumlah, userId } = req.body;
    if (!narasiId || !organisasiId || !jumlah) {
      return res.status(400).json({ error: "narasiId, organisasiId, dan jumlah wajib diisi" });
    }
    // If userId is provided, deduct saldo from user/organisasi wallet
    if (userId) {
      const userRef = db.collection("user").doc(userId);
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) throw new Error("User tidak ditemukan");
        const prev = userDoc.data().saldo || 0;
        if (prev < Number(jumlah)) throw new Error("Saldo tidak cukup");
        t.update(userRef, { saldo: prev - Number(jumlah) });
      });
    }
    const result = await pembayaranService.tambahCrowdfund(narasiId, organisasiId, Number(jumlah), false, userId || null);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPembayaranByNarasi = async (req, res) => {
  try {
    const { narasiId } = req.params;
    const result = await pembayaranService.getPembayaranByNarasi(narasiId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tambahCrowdfundOrganisasi = async (req, res) => {
  try {
    const { organisasiId, jumlah, userId } = req.body;
    if (!organisasiId || !jumlah) {
      return res.status(400).json({ error: "organisasiId dan jumlah wajib diisi" });
    }
    // If userId is provided, deduct saldo from user/organisasi wallet
    if (userId) {
      const userRef = db.collection("user").doc(userId);
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) throw new Error("User tidak ditemukan");
        const prev = userDoc.data().saldo || 0;
        if (prev < Number(jumlah)) throw new Error("Saldo tidak cukup");
        t.update(userRef, { saldo: prev - Number(jumlah) });
      });
    }
    const result = await pembayaranService.tambahCrowdfundOrganisasi(organisasiId, Number(jumlah), userId || null);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPembayaranByOrganisasi = async (req, res) => {
  try {
    const { organisasiId } = req.params;
    const result = await pembayaranService.getPembayaranByOrganisasi(organisasiId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaldo = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId wajib diisi" });
    const userDoc = await db.collection("user").doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User tidak ditemukan" });
    const saldo = userDoc.data().saldo || 0;
    res.json({ userId, saldo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
