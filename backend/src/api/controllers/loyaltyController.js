const Loyalty = require("../models/loyalty");
const PromoCode = require("../models/loyaltyPromos");

// Helper function to determine tier based on loyalty points
function determineTier(loyaltyPoints) {
  if (loyaltyPoints >= 0 && loyaltyPoints <= 299) {
    return "Grey";
  } else if (loyaltyPoints >= 300 && loyaltyPoints <= 599) {
    return "Bronze";
  } else if (loyaltyPoints >= 600 && loyaltyPoints <= 1199) {
    return "Silver";
  } else if (loyaltyPoints >= 1200 && loyaltyPoints <= 3599) {
    return "Gold";
  } else if (loyaltyPoints >= 3600) {
    return "Platinum";
  }
}

// Add a new customer
exports.addCustomer = async (req, res) => {
  try {
    const newCustomer = new Loyalty(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Loyalty.find();
    res.json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update loyalty points
/*
exports.updateLoyaltyPoints = async (req, res) => {
  try {
    console.log("Request received:");
    console.log("Email:", req.params.email);
    console.log("Points:", req.body.points);

    const { points } = req.body;
    const customer = await Loyalty.findOneAndUpdate(
      { email: req.params.email },
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );
    if (!customer) {
      console.log("Customer not found");
      return res.status(403).json({ error: "Customer not found" });
    }
    console.log("Customer updated:", customer);
    res.json(customer);
  } catch (err) {
    console.error("Error updating loyalty points:", err);
    res.status(400).json({ error: err.message });
  }
}; */

// Update loyalty points and tier
exports.updateLoyaltyPoints = async (req, res) => {
  try {
    console.log("Request received:");
    console.log("Email:", req.params.email);
    console.log("Points:", req.body.points);

    const { points } = req.body;
    const customer = await Loyalty.findOneAndUpdate(
      { email: req.params.email },
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    if (!customer) {
      console.log("Customer not found");
      return res.status(403).json({ error: "Customer not found" });
    }

    // Determine new tier based on updated loyalty points
    const newTier = determineTier(customer.loyaltyPoints);

    // Update the tier if it has changed
    if (customer.tier !== newTier) {
      customer.tier = newTier;
      await customer.save();
    }

    console.log("Customer updated:", customer);
    res.json(customer);
  } catch (err) {
    console.error("Error updating loyalty points:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update newMember status
exports.updateNewMemberStatus = async (req, res) => {
  try {
    const { newMember } = req.body;
    const customer = await Loyalty.findByIdAndUpdate(
      req.params.id,
      { newMember },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Check if customer email exists
exports.checkCustomerEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Loyalty.findOne({ email });
    if (customer) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get customer details by email
exports.getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Loyalty.findOne({ email: req.params.email });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a new promo code
exports.addPromoCode = async (req, res) => {
  try {
    const newPromoCode = new PromoCode(req.body);
    await newPromoCode.save();
    res.status(201).json(newPromoCode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Validate and apply promo code
exports.validatePromoCode = async (req, res) => {
  try {
    const { promoCode } = req.body;
    const promo = await PromoCode.findOne({ code: promoCode });

    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
    }

    // Check if the promo code has expired
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "Promo code has expired" });
    }

    // Determine the discount
    const discount = {
      percentage: promo.discountPercentage,
      amount: promo.discountAmount,
    };

    return res.status(200).json({ success: true, discount });
  } catch (error) {
    console.error("Failed to validate promo code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get promo codes by tier
exports.getPromoCodesByTier = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ tier: req.params.tier });
    res.json(promoCodes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
