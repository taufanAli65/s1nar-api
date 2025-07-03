const narasiService = require("../services/narasiService");
const { getOrganisasiById } = require("../helpers/organisasiHelper");
const { isFirstNarasiForOrganisasi } = require("../helpers/crowdfundHelper");
const pembayaranService = require("../services/pembayaranService");

exports.createNarasi = async (req, res) => {
  try {
    const { judul, deskripsi, id_organisasi, expired_at, status, crowdfund } = req.body;
    const fotoUrl = req.fotoUrl || null;

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
    });

    // Jika narasi pertama, organisasi harus mengisi crowdfund sendiri
    if (isFirst) {
      await pembayaranService.tambahCrowdfund(narasi.id, id_organisasi, Number(crowdfund), true);
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
    const narasi = await narasiService.updateNarasi(req.params.id, req.body);
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
