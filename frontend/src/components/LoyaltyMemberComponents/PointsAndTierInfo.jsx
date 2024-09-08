import React from "react";

const PointsAndTierInfo = ({
  customer,
  getTierTextColor,
  getTierBorderClass,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h2 className="text-2xl font-semibold mb-4">Loyalty Points and Tier</h2>
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
      <span className={`text-2xl font-bold ${getTierTextColor(customer.tier)}`}>
        {customer.tier}
      </span>
    </div>
  </div>
);

export default PointsAndTierInfo;
