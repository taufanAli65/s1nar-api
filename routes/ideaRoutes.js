const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");
const uploadAttachmentIdea = require("../middleware/uploadAttachmentIdea");

// User membuat idea berdasarkan narasi_id (hanya narasi aktif)
router.post("/", uploadAttachmentIdea, ideaController.createIdea);

// User merevisi idea
router.post("/:id/revisi", ideaController.addRevisi);

// Organisasi melihat list idea berdasarkan narasi yang dibuatnya
router.get("/organisasi/:organisasi_id", ideaController.getIdeasByOrganisasi);

// User melihat idea berdasarkan narasi_id
router.get("/narasi/:narasi_id", ideaController.getIdeasByNarasi);

// User melihat idea berdasarkan kategori narasi (hanya narasi aktif)
router.get("/kategori/:kategory_konten", ideaController.getIdeasByKategori);

// User melihat idea yang pernah dibuatnya
router.get("/user/:user_id", ideaController.getIdeasByUser);

// Organisasi update status idea (revisi/reject)
router.patch("/:id/status", ideaController.updateIdeaStatus);

// Organisasi acc idea (pindah ke content, transfer saldo user)
router.post("/:id/acc", ideaController.accIdea);

module.exports = router;
