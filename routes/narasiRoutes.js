const express = require("express");
const router = express.Router();
const narasiController = require("../controllers/narasiController");
const uploadFotoSupabase = require("../middleware/uploadFotoSupabase");

router.post("/", uploadFotoSupabase, narasiController.createNarasi);
router.get("/", narasiController.getAllNarasi);
router.get("/:id", narasiController.getNarasiById);
router.put("/:id", narasiController.updateNarasi);
router.delete("/:id", narasiController.deleteNarasi);
router.patch("/:id/expired", narasiController.expireNarasi);

module.exports = router;
