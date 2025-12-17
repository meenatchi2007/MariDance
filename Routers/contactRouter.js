const express = require("express");
const router = express.Router();
const { handleContactForm } = require('../Controllers/contactController');

router.post("/", handleContactForm);
router.post("/contact", handleContactForm);

module.exports = router;
