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
