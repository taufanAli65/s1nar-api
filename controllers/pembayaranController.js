const pembayaranService = require("../services/pembayaranService");

exports.tambahCrowdfund = async (req, res) => {
  try {
    const { narasiId, organisasiId, jumlah } = req.body;
    if (!narasiId || !organisasiId || !jumlah) {
      return res.status(400).json({ error: "narasiId, organisasiId, dan jumlah wajib diisi" });
    }
    const result = await pembayaranService.tambahCrowdfund(narasiId, organisasiId, jumlah, false);
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
