// src/components/ShoppingHome.js
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CapImage from "../../../assets/cap.jpg";
import MenFashion from "../../../assets/men.jpg";
import WomenFashion from "../../../assets/women.jpg";

const ShoppingHome = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[60vh] bg-hero-pattern flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-6 max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-4">Discover Your Style</h1>
          <p className="text-lg mb-8">
            Explore the latest trends in fashion and find your perfect look with
            our exclusive collections.
          </p>
          <Button className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Categories
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-64">
            <img
              src={MenFashion}
              alt="Men's Fashion"
              className="w-full h-96 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Men's Fashion</h3>
              <p className="text-gray-600 mb-4">
                Explore our latest men's fashion trends and styles.
              </p>
              <Link to="/shop/men" className="text-red-500 font-semibold">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-64">
            <img
              src={WomenFashion}
              alt="Women's Fashion"
              className="w-full h-96 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Women's Fashion</h3>
              <p className="text-gray-600 mb-4">
                Find the latest trends and styles for women.
              </p>
              <Link to="/shop/women" className="text-red-500 font-semibold">
                Shop Now
              </Link>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-64">
            <img
              src={CapImage}
              alt="Accessories"
              className="w-full h-96 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Accessories</h3>
              <p className="text-gray-600 mb-4">
                Complete your look with our exclusive accessories.
              </p>
              <Link
                to="/shop/accessories"
                className="text-red-500 font-semibold"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-red-500 text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
        <p className="text-lg mb-6">
          Get 20% off on all orders over $100. Use code: SALE20
        </p>
        <Link
          to="/shop"
          className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold"
        >
          Shop Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 Fashion Industry. All rights reserved.</p>
        <p>
          <Link to="/privacy-policy" className="text-gray-400 hover:underline">
            Privacy Policy
          </Link>{" "}
          |
          <Link
            to="/terms-of-service"
            className="text-gray-400 hover:underline"
          >
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default ShoppingHome;
