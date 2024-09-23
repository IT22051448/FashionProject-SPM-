import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AddressSchema = new Schema(
  {
    userId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

export default model("Address", AddressSchema);
