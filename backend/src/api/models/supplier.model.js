const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supId: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^[A-Za-z]\d{3}.*$/,
      "supId must start with one letter followed by three digits", // validate supplier ID
    ],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"], //  email validation
  },
  phone: {
    type: String,

    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], //  phone number validation
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
