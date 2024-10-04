// src/components/AdminDashboard.js
import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart,
  User,
  Bell,
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex h-auto bg-gray-100 border-2 border-black">
      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 p-2 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
            <p className="mt-2 text-2xl font-bold text-green-500">$25,300</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">New Orders</h3>
            <p className="mt-2 text-2xl font-bold text-blue-500">1,240</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Top Product</h3>
            <p className="mt-2 text-lg font-bold text-gray-800">Summer Dress</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">
              Customer Rating
            </h3>
            <p className="mt-2 text-2xl font-bold text-yellow-500">4.8/5</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-3 text-sm">
              <span className="text-green-500">•</span>
              <p>New order placed by Jane Doe</p>
            </li>
            <li className="flex items-center space-x-3 text-sm">
              <span className="text-red-500">•</span>
              <p>Stock running low for Denim Jeans</p>
            </li>
          </ul>
        </section>

        {/* Sales and Traffic Charts */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sales Performance
            </h3>
            {/* Placeholder for Chart */}
            <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
              Sales Chart
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Website Traffic
            </h3>
            {/* Placeholder for Chart */}
            <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
              Traffic Chart
            </div>
          </div>
        </section>

        {/* Order and Inventory Updates */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Orders
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Order #1023</span>
                <span className="text-green-500">Completed</span>
              </li>
              <li className="flex justify-between">
                <span>Order #1024</span>
                <span className="text-yellow-500">Pending</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Inventory Status
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Red T-Shirts</span>
                <span className="text-red-500">Low Stock</span>
              </li>
              <li className="flex justify-between">
                <span>Blue Jeans</span>
                <span className="text-green-500">In Stock</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
