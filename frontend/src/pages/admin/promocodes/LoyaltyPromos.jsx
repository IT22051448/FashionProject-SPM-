import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PromoCodes = () => {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expiresAt = endDate ? new Date(endDate) : null;
    const discountPercentageValue = discountPercentage
      ? parseFloat(discountPercentage)
      : null;
    const discountAmountValue = discountAmount
      ? parseFloat(discountAmount)
      : null;

    const promoData = {
      code,
      description,
      tier,
      expiresAt,
      discountPercentage: discountPercentageValue,
      discountAmount: discountAmountValue,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/loyalty/promo-codes",
        promoData
      );
      alert("Promo code created successfully!");
    } catch (error) {
      console.error("Error creating promo code:", error);
      alert("Error creating promo code. Please try again.");
    }
  };

  const handleViewPromoCodes = () => {
    navigate("/admin/view-promos");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Title on the left */}
        <h1 className="text-2xl font-bold">Create Promo Codes</h1>

        {/* Button on the right */}
        <button
          type="button"
          onClick={handleViewPromoCodes}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View All Promo Codes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tier
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Tier</option>
            <option value="Grey">Grey</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Discount Percentage (optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., 10 for 10%"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Discount Amount (optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., 200 for 200 LKR"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
        >
          Create Promo Code
        </button>
      </form>
    </div>
  );
};

export default PromoCodes;
