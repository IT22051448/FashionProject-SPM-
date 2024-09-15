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
  getAllPromoCodes,
  deletePromoCode,
  getPromoCodeById,
  updatePromoCodeById,
  applyPromoCode,
  updateCustomer,
  deleteCustomerByEmail,
  updateCustomerTier,
} = require("../controllers/loyaltyController");

// Add a new customer
router.post("/create-customer", addCustomer);

// Get all customers
router.get("/get-customers", getAllCustomers);

// Update loyalty points
router.patch("/email/:email/points", updateLoyaltyPoints);

// Update newMember status
router.patch("/:id/newMember", updateNewMemberStatus);

// Check if customer email exists
router.post("/check-customer", checkCustomerEmail);

// Get customer details by email
router.get("/customer/:email", getCustomerByEmail);

// Update customer details
router.put("/update-customer/:email", updateCustomer);

//Delete Loyalty Customer
router.delete("/delete-customer/:email", deleteCustomerByEmail);

// Get promo codes by tier
router.get("/promo-codes/:tier", getPromoCodesByTier);

// Add a new promo code
router.post("/promo-codes", addPromoCode);

// Validate and apply a promo code
router.post("/validate-promo-code", validatePromoCode);

// Get All Promo Codes
router.get("/promo-codes", getAllPromoCodes);

// Delete a promo code by ID
router.delete("/promo-codes/:id", deletePromoCode);

// Get a promo code by ID
router.get("/promocodes/:id", getPromoCodeById);

// Update a promo code by ID
router.put("/promocodes/:id", updatePromoCodeById);

// Route to apply promo code
router.post("/apply-promo-code", applyPromoCode);

// Update customer tier
router.patch("/:email/tier", updateCustomerTier);

module.exports = router;
