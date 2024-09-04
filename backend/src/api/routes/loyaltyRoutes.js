const express = require("express");
const router = express.Router();
const {
  addCustomer,
  getAllCustomers,
  updateLoyaltyPoints,
  updateNewMemberStatus,
  checkCustomerEmail,
  getCustomerByEmail,
  getPromoCodesByTier,
  addPromoCode,
  validatePromoCode,
} = require("../controllers/loyaltyController");

// Add a new customer
router.post("/create-customer", addCustomer);

// Get all customers
router.get("/", getAllCustomers);

// Update loyalty points
router.patch("/email/:email/points", updateLoyaltyPoints);

// Update newMember status
router.patch("/:id/newMember", updateNewMemberStatus);

// Check if customer email exists
router.post("/check-customer", checkCustomerEmail);

// Get customer details by email
router.get("/customer/:email", getCustomerByEmail);

// Get promo codes by tier
router.get("/promo-codes/:tier", getPromoCodesByTier);

// Add a new promo code
router.post("/promo-codes", addPromoCode);

// Validate and apply a promo code
router.post("/validate-promo-code", validatePromoCode);

module.exports = router;
