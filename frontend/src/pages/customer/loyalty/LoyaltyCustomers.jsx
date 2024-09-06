import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLoyaltyCustomer } from "../../../redux/loyaltySlice/loyaltySlice";

const NewLoyaltyCustomerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State hooks for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Initialize joinDate to today's date
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Access Email from Redux
  const userEmail = useSelector((state) => state.auth.user?.email);

  // Update the email state when the component renders
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, phoneNumber, dateOfBirth, joinDate };

    // Dispatch the createLoyaltyCustomer action
    dispatch(createLoyaltyCustomer(formData))
      .unwrap()
      .then(() => {
        console.log("Customer added successfully");
        navigate("/shop");
      })
      .catch((error) => {
        console.error("There was an error adding the customer:", error);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "dateOfBirth":
        setDateOfBirth(value);
        break;
      case "joinDate":
        setJoinDate(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="container max-w-full max-h-full">
        <div className="flex justify-center items-center h-screen">
          <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3 relative">
            <div className="bg-blue-50 opacity-95 rounded-lg p-8 border-blue-300 border-4">
              <h1 className="text-center text-3xl font-bold mb-4">
                Loyalty Customers Program
              </h1>
              <hr className="border-slate-500 border-t-2 mx-auto w-4/5 mt-2" />

              {/* Form Start */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="mt-5 block text-lg font-bold text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="mt-5 block text-lg font-bold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      readOnly // Make the email field non-editable
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-lg font-bold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-lg font-bold text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-lg font-bold text-gray-700">
                      Join Date
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      value={joinDate}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div className="w-1/2 flex items-end justify-end space-x-2">
                    <button
                      type="submit"
                      className="mt-4 inline-flex justify-center py-4 px-16 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="mt-4 inline-flex justify-center py-4 px-16 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLoyaltyCustomerForm;
