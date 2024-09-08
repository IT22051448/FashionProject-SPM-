import React from "react";

const PromoCodes = ({ validPromoCodes, applyPromoCode, formatDate }) => (
  <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
    <h2 className="text-2xl font-semibold mb-4">Available Promo Codes</h2>
    {validPromoCodes.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validPromoCodes.map((promo) => (
          <div
            key={promo._id}
            className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-2">{promo.code}</h3>
            <p className="text-lg">{promo.description}</p>
            <p className="text-lg">
              <strong className="text-gray-700">Expiry Date:</strong>{" "}
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
      <p className="text-lg">No promo codes available at the moment.</p>
    )}
  </div>
);

export default PromoCodes;
