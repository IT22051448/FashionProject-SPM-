import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createLoyaltyCustomer } from "../../../redux/loyaltySlice/loyaltySlice";
import { loyaltyFormControls } from "../../../config/loyaltyFormConfig";
import { useToast } from "@/hooks/use-toast";

const NewLoyaltyCustomerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // State hooks for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const [errorMessages, setErrorMessages] = useState({});

  // Access Email from Redux
  const userEmail = useSelector((state) => state.auth.user?.email);

  // Update the email state when the component renders
  useEffect(() => {
    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }
  }, [userEmail]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createLoyaltyCustomer(formData)).unwrap();
      toast({
        title: "Success",
        description:
          "Congratulations! you have successfully joined the Loyalty Program, please refresh the page",
        type: "success",
      });
      console.log("Customer added successfully");
      navigate("/shop/home");
    } catch (error) {
      console.error("There was an error adding the customer:", error);
      toast({
        title: "Error",
        description: "Failed to add customer.",
        type: "error",
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessages((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle focus on read-only fields to show error message
  const handleFocus = (control) => {
    if (control.readOnly && control.errorMessage) {
      setErrorMessages((prev) => ({
        ...prev,
        [control.name]: control.errorMessage,
      }));
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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loyaltyFormControls.map((control) => (
                    <div key={control.name}>
                      <label className="block text-lg font-bold text-gray-700">
                        {control.label}
                      </label>
                      {control.componentType === "input" && (
                        <>
                          <input
                            type={control.type}
                            name={control.name}
                            value={formData[control.name]}
                            onChange={handleChange}
                            onFocus={() => handleFocus(control)}
                            placeholder={control.placeholder}
                            readOnly={control.readOnly}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                          />
                          {errorMessages[control.name] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errorMessages[control.name]}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 justify-end">
                  <button
                    type="submit"
                    className="py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

export default NewLoyaltyCustomerForm;
