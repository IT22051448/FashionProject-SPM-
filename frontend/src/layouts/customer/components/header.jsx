// src/components/ShoppingHeader.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkLoyaltyCustomer } from "../../../redux/loyaltySlice/loyaltySlice";
import { logoutUser } from "../../../redux/authSlice"; // Adjusted import path

const ShoppingHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoyaltyCustomer = useSelector(
    (state) => state.loyalty.isLoyaltyCustomer
  );
  const userEmail = useSelector((state) => state.auth.user?.email);

  React.useEffect(() => {
    if (userEmail) {
      dispatch(checkLoyaltyCustomer(userEmail));
    }
  }, [userEmail, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex items-center">
      <div className="text-2xl font-bold flex-shrink-0">Fashion Industry</div>
      <div className="flex-grow"></div>
      <nav className="flex space-x-6">
        <Link to="/about" className="hover:underline">
          About Us
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact Us
        </Link>
        {isLoyaltyCustomer ? (
          <Link to="/shop/loyaltyMember" className="hover:underline">
            Loyalty Profile
          </Link>
        ) : (
          <Link to="/shop/loyaltySignUp" className="hover:underline">
            Become a Loyalty Member
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="hover:underline bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default ShoppingHeader;
