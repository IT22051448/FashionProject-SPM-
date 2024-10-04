const express = require("express");
const router = express.Router();
const { createReferral } = require("../controllers/referralController");

// Create a referral
router.post("/refer", createReferral);

module.exports = router;
