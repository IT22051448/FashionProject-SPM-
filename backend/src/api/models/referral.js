const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
  referrerEmail: { type: String, required: true },
  referredEmail: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Referral", ReferralSchema);
