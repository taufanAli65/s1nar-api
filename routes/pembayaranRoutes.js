const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaranController");

router.post("/", pembayaranController.tambahCrowdfund);
router.get("/:narasiId", pembayaranController.getPembayaranByNarasi);
router.post("/organisasi", pembayaranController.tambahCrowdfundOrganisasi);
router.get("/organisasi/:organisasiId", pembayaranController.getPembayaranByOrganisasi);
router.post("/topup", pembayaranController.topUpSaldo);
router.get("/saldo/:userId", pembayaranController.getSaldo);

module.exports = router;
