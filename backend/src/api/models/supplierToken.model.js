const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierTokenSchema = new Schema({
  token: {
    type: String,
    required: true, 
  },
  data: [
    {
      quantity: {
        type: Number,
       
      },
      date: {
        type: Date,
       
      },
      itemId: {
        type: String,
        
      },
    },
  ],
 
} ,{ timestamps: true });

module.exports = mongoose.model("SupplierToken", supplierTokenSchema);