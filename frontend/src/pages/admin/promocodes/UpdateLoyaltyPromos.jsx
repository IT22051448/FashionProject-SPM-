import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateLoyaltyPromos = () => {
  const { id } = useParams(); // Get the promo code ID from URL params
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current promo code data when the component mounts
    const fetchPromoCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/loyalty/promocodes/${id}`
        );
        const promo = response.data;
        console.log("Fetched promo code data:", promo);

        setCode(promo.code || "");
        setDescription(promo.description || "");
        setTier(promo.tier || "");
        setExpiresAt(
          promo.expiresAt
            ? new Date(promo.expiresAt).toISOString().split("T")[0]
            : ""
        );
        setDiscountPercentage(promo.discountPercentage || "");
        setDiscountAmount(promo.discountAmount || "");
      } catch (error) {
        setError("Failed to fetch promo code details.");
        console.error("Error fetching promo code data:", error);
      }
    };

    fetchPromoCode();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const promoData = {
      code,
      description,
      tier,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      discountPercentage: discountPercentage
        ? parseFloat(discountPercentage)
        : null,
      discountAmount: discountAmount ? parseFloat(discountAmount) : null,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/loyalty/promocodes/${id}`,
        promoData
      );
      alert("Promo code updated successfully!");
      navigate("/admin/view-promos");
    } catch (error) {
      console.error("Error updating promo code:", error);
      alert("Error updating promo code. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Update Promo Code</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md">
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
            Expiry Date
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
        >
          Update Promo Code
        </button>
      </form>
    </div>
  );
};

export default UpdateLoyaltyPromos;
