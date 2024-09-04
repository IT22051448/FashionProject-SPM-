const mongoose = require("mongoose");

const loyaltyPromosSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tier: { type: String, required: true },
  expiresAt: { type: Date, default: null }, // null means no expiration
  discountPercentage: { type: Number, default: null }, // Discount in percentage
  discountAmount: { type: Number, default: null }, // Discount in cash amount
});

module.exports = mongoose.model("loyaltyPromos", loyaltyPromosSchema);
