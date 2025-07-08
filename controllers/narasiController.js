const narasiService = require("../services/narasiService");
const { getOrganisasiById } = require("../helpers/organisasiHelper");
const { isFirstNarasiForOrganisasi } = require("../helpers/crowdfundHelper");
const pembayaranService = require("../services/pembayaranService");

exports.createNarasi = async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      id_organisasi,
      expired_at,
      status,
      crowdfund,
      kategory_konten,
      budget_infografis,
      budget_poster,
      budget_video,
      budget_meme,
      budget_gambar,
      userId, // <-- allow userId in body
    } = req.body;
    const fotoUrl = req.fotoUrl || null;

    // Validasi enum kategori konten
    const allowedKategori = ["infografis", "poster", "video", "meme", "gambar"];
    if (!allowedKategori.includes(kategory_konten)) {
      return res.status(400).json({ error: "kategory_konten harus salah satu dari: " + allowedKategori.join(", ") });
    }

    // Cek jika narasi pertama, crowdfund wajib diisi dan organisasi harus mengisi crowdfund sendiri
    const isFirst = await isFirstNarasiForOrganisasi(id_organisasi);
    if (isFirst && (!crowdfund || isNaN(Number(crowdfund)))) {
      return res.status(400).json({ error: "Crowdfund wajib diisi untuk narasi pertama organisasi" });
    }

    // Buat narasi
    const narasi = await narasiService.createNarasi({
      judul,
      deskripsi,
      id_organisasi,
      fotoUrl,
      expired_at: expired_at || null,
      status: status || "active",
      kategory_konten,
      budget_infografis: Number(budget_infografis) || 0,
      budget_poster: Number(budget_poster) || 0,
      budget_video: Number(budget_video) || 0,
      budget_meme: Number(budget_meme) || 0,
      budget_gambar: Number(budget_gambar) || 0,
    });

    // Jika narasi pertama, organisasi harus mengisi crowdfund sendiri dan saldo dikurangi
    if (isFirst) {
      if (!userId) {
        return res.status(400).json({ error: "userId wajib diisi untuk narasi pertama (organisasi)" });
      }
      // Deduct saldo from organisasi wallet
      const admin = require("firebase-admin");
      const db = admin.firestore();
      const userRef = db.collection("user").doc(userId);
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) throw new Error("User tidak ditemukan");
        const prev = userDoc.data().saldo || 0;
        if (prev < Number(crowdfund)) throw new Error("Saldo tidak cukup");
        t.update(userRef, { saldo: prev - Number(crowdfund) });
      });
      await pembayaranService.tambahCrowdfund(narasi.id, id_organisasi, Number(crowdfund), true, userId);
    }

    res.status(201).json(narasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllNarasi = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const narasiList = await narasiService.getNarasiList({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });
    const narasiWithOrg = await Promise.all(
      narasiList.map(async (narasi) => {
        const org = narasi.id_organisasi
          ? await getOrganisasiById(narasi.id_organisasi)
          : null;
        return {
          ...narasi,
          namaOrganisasi: org ? org.nama : null,
          fotoProfile: org ? org.fotoProfile : null,
        };
      })
    );
    res.json(narasiWithOrg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNarasiById = async (req, res) => {
  try {
    const narasi = await narasiService.getNarasiById(req.params.id);
    if (!narasi) return res.status(404).json({ error: "Not found" });
    let org = null;
    if (narasi.id_organisasi) {
      org = await getOrganisasiById(narasi.id_organisasi);
    }
    res.json({
      ...narasi,
      namaOrganisasi: org ? org.nama : null,
      fotoProfile: org ? org.fotoProfile : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNarasi = async (req, res) => {
  try {
    const data = { ...req.body };
    // Validasi enum jika ada update kategori konten
    if (data.kategory_konten) {
      const allowedKategori = ["infografis", "poster", "video", "meme", "gambar"];
      if (!allowedKategori.includes(data.kategory_konten)) {
        return res.status(400).json({ error: "kategory_konten harus salah satu dari: " + allowedKategori.join(", ") });
      }
    }
    // Pastikan budget dikonversi ke number jika ada
    ["budget_infografis", "budget_poster", "budget_video", "budget_meme", "budget_gambar"].forEach(key => {
      if (data[key] !== undefined) data[key] = Number(data[key]) || 0;
    });
    const narasi = await narasiService.updateNarasi(req.params.id, data);
    res.json(narasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNarasi = async (req, res) => {
  try {
    await narasiService.deleteNarasi(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.expireNarasi = async (req, res) => {
  try {
    const narasi = await narasiService.updateNarasi(req.params.id, { status: "expired" });
    res.json(narasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
