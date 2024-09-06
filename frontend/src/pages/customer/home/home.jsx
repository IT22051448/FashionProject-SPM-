// ShoppingHome.js
import React from "react";
import { useNavigate } from "react-router-dom";

const ShoppingHome = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/shop/loyaltySignUp");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleNavigate}>Go to Another Page</button>
    </div>
  );
};

export default ShoppingHome;
