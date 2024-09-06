const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    itemId: { type: String, required: true, unique: true },
    price: { type: Number, required: true }, 
    salePrice: { type: Number }, 
    totalStock: { type: Number, required: true },
    supplier: { type: String, required: true },
    lowStockThreshold: { type: Number, required: true, default: 50 }, 
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Stock", stockSchema);
