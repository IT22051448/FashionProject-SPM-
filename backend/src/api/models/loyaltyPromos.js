const mongoose = require("mongoose");

const loyaltyPromosSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tier: { type: String, required: true },
  startDate: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  discountPercentage: { type: Number, default: null },
  discountAmount: { type: Number, default: null },
});

module.exports = mongoose.model("loyaltyPromos", loyaltyPromosSchema);
