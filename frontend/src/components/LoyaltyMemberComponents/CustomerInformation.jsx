import React from "react";

const CustomerInformation = ({ customer, formatDate, navigate }) => {
  const handleEditClick = () => {
    navigate(`/shop/update-member/${customer.email}`);
  };

  return (
    <div className="flex items-start bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Customer Information
        </h2>
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="text-gray-700">Name:</strong>{" "}
            <span className="font-bold text-gray-900">{customer.name}</span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Email:</strong>{" "}
            <span className="font-bold text-gray-900">{customer.email}</span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Phone Number:</strong>{" "}
            <span className="font-bold text-gray-900">
              {customer.phoneNumber}
            </span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">Date of Birth:</strong>{" "}
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
      <div className="ml-20 flex-shrink-0 space-y-2">
        <button
          onClick={handleEditClick}
          className="inline-flex items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
        >
          Edit Information
        </button>
        <button
          onClick={() => navigate("/shop/LoyaltyReferral")}
          className="inline-flex items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Refer a Friend
        </button>
      </div>
    </div>
  );
};

export default CustomerInformation;
