const mongoose = require("mongoose");

const LoyaltySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  joinDate: { type: Date, required: true },
  loyaltyPoints: { type: Number, default: 0 },
  newMember: { type: Boolean, default: true },
  tier: {
    type: String,
    enum: ["Grey", "Bronze", "Silver", "Gold", "Platinum"],
    default: "Grey",
  },
});

module.exports = mongoose.model("Loyalty", LoyaltySchema);
