import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewLoyaltyPromos = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all promo codes
  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/loyalty/promo-codes"
      );
      setPromoCodes(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching promo codes."
      );
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Does not Expire";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group promo codes by tier
  const groupedPromoCodes = promoCodes.reduce((acc, promo) => {
    const { tier } = promo;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(promo);
    return acc;
  }, {});

  // Determine background color and border color based on tier
  const getStylesForTier = (tier) => {
    switch (tier) {
      case "Gold":
        return {
          backgroundColor: "bg-yellow-400 bg-opacity-50",
          borderColor: "border-yellow-600",
        };
      case "Silver":
        return {
          backgroundColor: "bg-gray-300",
          borderColor: "border-gray-600",
        };
      case "Bronze":
        return {
          backgroundColor: "bg-orange-400 bg-opacity-50",
          borderColor: "border-orange-600",
        };
      case "Platinum":
        return {
          backgroundColor: "bg-blue-400 bg-opacity-50",
          borderColor: "border-blue-600",
        };
      case "Grey":
        return {
          backgroundColor: "bg-gray-500 bg-opacity-50",
          borderColor: "border-gray-700",
        };
      default:
        return {
          backgroundColor: "bg-white",
          borderColor: "border-gray-300",
        };
    }
  };

  // Handle update button click
  const handleUpdate = (promo) => {
    navigate(`/admin/update-promos/${promo._id}`);
  };

  // Handle delete button click
  const handleDelete = async (promoId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/loyalty/promo-codes/${promoId}`
      );
      setPromoCodes(promoCodes.filter((promo) => promo._id !== promoId));
    } catch (err) {
      setError("Failed to delete promo code.");
    }
  };

  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="flex-grow flex justify-center items-start p-4">
      <div className="w-full md:w-11/12 lg:w-5/6 xl:w-3/4 relative border-2 border-black">
        <div className="p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
          <h1 className="text-center text-4xl font-bold mb-6 text-black">
            Available Promo Codes
          </h1>
          <hr className="border-slate-500 border-t-2 mx-auto w-4/5 mb-6" />

          {Object.entries(groupedPromoCodes).map(([tier, promos]) => (
            <div key={tier} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {tier} Tier
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promos.map((promo) => {
                  const styles = getStylesForTier(promo.tier);
                  return (
                    <div
                      key={promo._id}
                      className={`p-6 rounded-lg shadow-md border-2 ${styles.backgroundColor} ${styles.borderColor}`}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        {promo.code}
                      </h3>
                      <p className="text-gray-700 mb-4">{promo.description}</p>
                      <p className="text-lg">
                        <strong className="text-gray-700">Tier:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {promo.tier}
                        </span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-gray-700">Expiry Date:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {promo.expiresAt
                            ? formatDate(promo.expiresAt)
                            : "Does Not Expire"}
                        </span>
                      </p>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleUpdate(promo)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(promo._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {promoCodes.length === 0 && (
            <p className="text-lg text-center">
              No promo codes available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLoyaltyPromos;
