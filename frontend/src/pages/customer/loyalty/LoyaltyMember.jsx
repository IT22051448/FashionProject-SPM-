import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomerDetails,
  fetchPromoCodes,
} from "../../../redux/loyaltySlice/loyaltySlice";
import CustomerInformation from "../../../components/LoyaltyMemberComponents/CustomerInformation";
import PointsAndTierInfo from "../../../components/LoyaltyMemberComponents/PointsAndTierInfo";
import PromoCodes from "../../../components/LoyaltyMemberComponents/PromoCodesComponent";

const MembershipDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userEmail = useSelector((state) => state.auth.user?.email);
  const customer = useSelector((state) => state.loyalty.customer);
  const promoCodes = useSelector((state) => state.loyalty.promoCodes) || [];
  const error = useSelector((state) => state.loyalty.error);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchCustomerDetails(userEmail));
    }
  }, [userEmail, dispatch]);

  useEffect(() => {
    if (customer?.tier) {
      dispatch(fetchPromoCodes(customer.tier));
    }
  }, [customer, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "Does not Expire";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getValidPromoCodes = (codes) => {
    if (!codes) return [];
    const today = new Date();
    return codes.filter((promo) => {
      const expiryDate = new Date(promo.expiresAt);
      return expiryDate >= today;
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
                <CustomerInformation
                  customer={customer}
                  formatDate={formatDate}
                  navigate={navigate}
                />
                <PointsAndTierInfo
                  customer={customer}
                  getTierTextColor={getTierTextColor}
                  getTierBorderClass={getTierBorderClass}
                />
                <PromoCodes
                  validPromoCodes={validPromoCodes}
                  applyPromoCode={applyPromoCode}
                  formatDate={formatDate}
                />
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
