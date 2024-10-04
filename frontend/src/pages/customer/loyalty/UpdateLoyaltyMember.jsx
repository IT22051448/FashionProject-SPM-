import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerDetails,
  updateCustomerDetails,
} from "@/redux/loyaltySlice/loyaltySlice";
import { loyaltyFormControls } from "../../../config/loyaltyFormConfig";
import { useToast } from "@/hooks/use-toast";

const UpdateLoyaltyMember = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get customer and loading/error states from the store
  const customer = useSelector((state) => state.loyalty.customer);
  const loading = useSelector((state) => state.loyalty.loading);
  const error = useSelector((state) => state.loyalty.error);

  // Get the email from the URL parameters
  const { email } = useParams();

  // Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    joinDate: "",
  });

  // Load customer details once on mount
  useEffect(() => {
    if (email) {
      dispatch(fetchCustomerDetails(email));
    }
  }, [dispatch, email]);

  // Update formData when customer data is fetched
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        dateOfBirth: customer.dateOfBirth
          ? new Date(customer.dateOfBirth).toISOString().split("T")[0]
          : "",
        joinDate: customer.joinDate
          ? new Date(customer.joinDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [customer]);

  /// Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the action to update the customer details
    dispatch(updateCustomerDetails({ email, updates: formData }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success!",
          description: "Customer information updated successfully.",
          variant: "success",
        });
        navigate("/shop/loyaltyMember");
      })
      .catch(() => {
        toast({
          title: "Error",
          description:
            "Failed to update customer information. Please try again.",
          variant: "error",
        });
      });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle uneditable fields click
  const handleFieldClick = (name) => {
    const control = loyaltyFormControls.find(
      (control) => control.name === name
    );
    if (control && control.readOnly) {
      toast({
        title: "Not Editable",
        description: `${control.label} field is not editable.`,
        variant: "warning",
      });
    }
  };

  // Handle loading and error states
  if (loading) return <p>Loading customer information...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="container max-w-full max-h-full">
        <div className="flex justify-center items-center h-screen">
          <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3 relative">
            <div className="bg-blue-50 opacity-95 rounded-lg p-8 border-blue-300 border-4">
              <h1 className="text-center text-3xl font-bold mb-4">
                Update Customer Information
              </h1>
              <hr className="border-slate-500 border-t-2 mx-auto w-4/5 mt-2" />

              {/* Form Start */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loyaltyFormControls.map((control) => (
                    <div key={control.name}>
                      <label className="block text-lg font-bold text-gray-700">
                        {control.label}
                      </label>
                      {control.componentType === "input" && (
                        <input
                          type={control.type}
                          name={control.name}
                          value={formData[control.name] || ""}
                          onChange={handleChange}
                          placeholder={control.placeholder}
                          readOnly={
                            control.readOnly ||
                            (control.name !== "name" &&
                              control.name !== "phoneNumber" &&
                              control.name !== "dateOfBirth")
                          }
                          onClick={() => handleFieldClick(control.name)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 justify-end">
                  <button
                    type="submit"
                    className="py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => navigate("/shop/home")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLoyaltyMember;
