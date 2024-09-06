import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ReferAFriend = () => {
  const [referredEmail, setReferredEmail] = useState("");
  const userEmail = useSelector((state) => state.auth.user?.email);
  const navigate = useNavigate();

  const handleRefer = async () => {
    try {
      if (!userEmail) {
        alert("User email is not available.");
        return;
      }

      await axios.post("http://localhost:5000/api/referral/refer", {
        // Check if this URL is correct
        referrerEmail: userEmail,
        referredEmail,
      });

      alert("Referral email sent successfully!");
      navigate("/LoyaltyMember");
    } catch (error) {
      console.error("Error sending referral email:", error);
      alert("Failed to send referral email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Refer a Friend
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Enter your friend's email below and we'll send them an invitation to
          join our loyalty program.
        </p>
        <input
          type="email"
          value={referredEmail}
          onChange={(e) => setReferredEmail(e.target.value)}
          placeholder="Enter your friend's email"
          className="border rounded px-4 py-2 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleRefer}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Send Referral
        </button>
      </div>
    </div>
  );
};

export default ReferAFriend;