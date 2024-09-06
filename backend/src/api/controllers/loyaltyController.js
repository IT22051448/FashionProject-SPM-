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

// Fetch all promo codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find(); // Fetch all promo codes from the database
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch promo codes" });
  }
};

// Delete a promo code by ID
exports.deletePromoCode = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the promo code by ID
    const deletedPromo = await PromoCode.findByIdAndDelete(id);

    // If no promo code found, return an error
    if (!deletedPromo) {
      return res.status(404).json({ error: "Promo code not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Promo code deleted successfully" });
  } catch (error) {
    // Handle any errors during the deletion process
    res.status(500).json({ error: "Failed to delete promo code" });
  }
};

// Update a promo code by ID
exports.updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Find the promo code by ID and update it with the provided data
    const updatedPromo = await PromoCode.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    // If no promo code found, return an error
    if (!updatedPromo) {
      return res.status(404).json({ error: "Promo code not found" });
    }

    // Return the updated promo code
    res.status(200).json(updatedPromo);
  } catch (error) {
    // Handle any errors during the update process
    res.status(400).json({ error: "Failed to update promo code" });
  }
};

exports.getPromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    console.log("Promo Code ID:", promoCodeId); // Check the received ID

    if (!promoCodeId) {
      console.error("Promo Code ID is undefined or missing");
      return res.status(400).json({ message: "Promo Code ID is required" });
    }

    const promoCode = await PromoCode.findById(promoCodeId);
    console.log("Fetched Promo Code:", promoCode); // Verify fetched promo code

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.json(promoCode);
  } catch (error) {
    console.error("Server Error:", error); // Log error details
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a promo code by ID
exports.updatePromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const updateData = req.body; // Data to update

    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      promoCodeId,
      updateData,
      { new: true }
    );

    if (!updatedPromoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.json(updatedPromoCode);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
