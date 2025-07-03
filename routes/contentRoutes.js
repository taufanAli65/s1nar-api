const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");

router.patch("/:id/status", contentController.updateContentStatus);

module.exports = router;
