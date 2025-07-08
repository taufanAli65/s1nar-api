const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const uploadFotoSupabase = require("../middleware/uploadFotoSupabase");

router.post("/register", uploadFotoSupabase, authController.register);
router.post("/login", authController.login);

module.exports = router;
