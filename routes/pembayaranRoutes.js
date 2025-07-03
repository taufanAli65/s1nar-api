const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaranController");

router.post("/", pembayaranController.tambahCrowdfund);
router.get("/:narasiId", pembayaranController.getPembayaranByNarasi);

module.exports = router;
