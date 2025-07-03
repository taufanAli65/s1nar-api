const ideaService = require("../services/ideaService");

exports.createIdea = async (req, res) => {
  try {
    const { judul_ide, deskripsi, narasi_id, user_id } = req.body;
    const attachment_file = req.attachmentUrl || null;
    const idea = await ideaService.createIdea({ judul_ide, attachment_file, deskripsi, narasi_id, user_id });
    res.status(201).json(idea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addRevisi = async (req, res) => {
  try {
    const { revisi } = req.body;
    const idea = await ideaService.addRevisi(req.params.id, revisi);
    res.json(idea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIdeasByNarasi = async (req, res) => {
  try {
    const ideas = await ideaService.getIdeasByNarasi(req.params.narasi_id);
    res.json(ideas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const ideas = await ideaService.getIdeasByUser(req.params.user_id);
    res.json(ideas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIdeasByOrganisasi = async (req, res) => {
  try {
    const ideas = await ideaService.getIdeasByOrganisasi(req.params.organisasi_id);
    res.json(ideas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIdeasByKategori = async (req, res) => {
  try {
    const ideas = await ideaService.getIdeasByKategori(req.params.kategory_konten);
    res.json(ideas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateIdeaStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const idea = await ideaService.updateIdeaStatus(req.params.id, status);
    res.json(idea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.accIdea = async (req, res) => {
  try {
    const result = await ideaService.accIdea(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
