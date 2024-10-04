import mongoose from "mongoose";

// define an user schema for a typical ecommerce customer and backend staff user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  avatar: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
  },
  referralCode: {
    type: String,
    default: null,
  },
  notifications: { type: [String], default: [] },
  created_date: {
    type: Date,
    required: true,
  },

  last_login: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
