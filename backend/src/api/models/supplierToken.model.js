const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierToken", supplierTokenSchema);
