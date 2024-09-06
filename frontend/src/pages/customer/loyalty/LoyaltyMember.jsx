import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MembershipDetails = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [error, setError] = useState(null);

  // Get customer email from Redux state
  const userEmail = useSelector((state) => state.auth.user?.email);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/loyalty/customer/${userEmail}`
      );
      setCustomer(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching customer details."
      );
    }
  };

  const fetchPromoCodes = async (tier) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/loyalty/promo-codes/${tier}`
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
    if (userEmail) {
      fetchCustomerDetails();
    }
  }, [userEmail]);

  useEffect(() => {
    if (customer?.tier) {
      fetchPromoCodes(customer.tier);
    }
  }, [customer]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Does not Expire";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter promo codes based on expiry date
  const getValidPromoCodes = (codes) => {
    const today = new Date();
    return codes.filter((promo) => {
      const expiryDate = new Date(promo.expiresAt);
      return (
        expiryDate >= today // Does not expire or valid date
      );
    });
  };

  const getBackgroundColorClass = (tier) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-400 bg-opacity-50";
      case "Silver":
        return "bg-gray-300";
      case "Bronze":
        return "bg-orange-400 bg-opacity-50";
      case "Platinum":
        return "bg-blue-400 bg-opacity-50";
      case "Grey":
        return "bg-gray-500 bg-opacity-50";
      default:
        return "bg-white bg-opacity-50";
    }
  };

  const applyPromoCode = (promoCode) => {
    sessionStorage.setItem("appliedPromoCode", promoCode);
    navigate("/CartPages");
  };

  if (error) return <div className="text-red-600 text-center">{error}</div>;

  const validPromoCodes = getValidPromoCodes(promoCodes);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="flex-grow flex justify-center items-start p-4">
        <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3 relative">
          <div
            className={`p-8 border border-gray-300 rounded-lg shadow-lg ${getBackgroundColorClass(
              customer?.tier
            )}`}
          >
            <h1 className="text-center text-4xl font-bold mb-6 text-black">
              Membership Details
            </h1>
            <hr className="border-slate-500 border-t-2 mx-auto w-4/5 mb-6" />

            {customer ? (
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="flex items-start bg-white p-6 rounded-lg shadow-md border border-gray-300">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                      Customer Information
                    </h2>
                    <div className="space-y-4">
                      <p className="text-lg">
                        <strong className="text-gray-700">Name:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {customer.name}
                        </span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-gray-700">Email:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {customer.email}
                        </span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-gray-700">Phone Number:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {customer.phoneNumber}
                        </span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-gray-700">
                          Date of Birth:
                        </strong>{" "}
                        <span className="font-bold text-gray-900">
                          {formatDate(customer.dateOfBirth)}
                        </span>
                      </p>
                      <p className="text-lg">
                        <strong className="text-gray-700">Join Date:</strong>{" "}
                        <span className="font-bold text-gray-900">
                          {formatDate(customer.joinDate)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="ml-6 flex-shrink-0">
                    <button
                      onClick={() => navigate("/shop/LoyaltyReferral")}
                      className="inline-flex items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Refer a Friend
                    </button>
                  </div>
                </div>

                {/* Points and Tier Information */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Loyalty Points and Tier
                  </h2>
                  <div className="flex justify-between items-center bg-green-100 p-4 rounded-lg shadow-sm border border-green-200 mb-4">
                    <span className="text-lg font-semibold text-green-800">
                      Loyalty Points:
                    </span>
                    <span className="text-2xl font-bold text-green-900">
                      {customer.loyaltyPoints}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-4 rounded-lg shadow-sm border ${getTierBorderClass(
                      customer.tier
                    )}`}
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      Membership Tier:
                    </span>
                    <span
                      className={`text-2xl font-bold ${getTierTextColor(
                        customer.tier
                      )}`}
                    >
                      {customer.tier}
                    </span>
                  </div>
                </div>

                {/* Render promo codes based on tier */}
                <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Available Promo Codes
                  </h2>
                  {validPromoCodes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {validPromoCodes.map((promo) => (
                        <div
                          key={promo._id}
                          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
                        >
                          <h3 className="text-xl font-semibold mb-2">
                            {promo.code}
                          </h3>
                          <p className="text-lg">{promo.description}</p>
                          <p className="text-lg">
                            <strong className="text-gray-700">
                              Expiry Date:
                            </strong>{" "}
                            <span className="font-bold text-gray-900">
                              {promo.expiresAt
                                ? formatDate(promo.expiresAt)
                                : "Does Not Expire"}
                            </span>
                          </p>
                          <button
                            onClick={() => applyPromoCode(promo.code)}
                            className="inline-flex items-center py-2 px-4 mt-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg">
                      No promo codes available at the moment.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-lg">Loading customer details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for tier styling
const getTierTextColor = (tier) => {
  switch (tier) {
    case "Gold":
      return "text-yellow-600";
    case "Silver":
      return "text-gray-600";
    case "Bronze":
      return "text-orange-600";
    case "Platinum":
      return "text-blue-600";
    case "Grey":
      return "text-gray-800";
    default:
      return "text-gray-900";
  }
};

const getTierBorderClass = (tier) => {
  switch (tier) {
    case "Gold":
      return "border-yellow-400";
    case "Silver":
      return "border-gray-300";
    case "Bronze":
      return "border-orange-400";
    case "Platinum":
      return "border-blue-400";
    case "Grey":
      return "border-gray-500";
    default:
      return "border-gray-200";
  }
};

export default MembershipDetails;
