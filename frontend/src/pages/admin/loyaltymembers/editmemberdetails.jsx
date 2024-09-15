import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerDetails,
  updateCustomerDetails,
} from "@/redux/loyaltySlice/loyaltySlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const tierOptions = ["Grey", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];

const EditMemberDetails = () => {
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer, loading, error } = useSelector((state) => state.loyalty);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    loyaltyPoints: 0,
    tier: "",
    joinDate: "",
  });

  // Fetch customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        await dispatch(fetchCustomerDetails(email)).unwrap(); // unwrap for handling promises
      } catch (err) {
        toast({
          title: "Error Fetching Customer",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    fetchCustomer();
  }, [dispatch, email, toast]);

  // Populate form data once the customer is fetched
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        loyaltyPoints: customer.loyaltyPoints || 0,
        tier: customer.tier || "",
        joinDate: customer.joinDate
          ? new Date(customer.joinDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are not empty
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "warning",
      });
      return;
    }

    try {
      // Dispatch update with proper data structure
      await dispatch(
        updateCustomerDetails({
          email: formData.email, // Pass email separately
          updates: {
            name: formData.name, // Pass the rest in an "updates" object
            phoneNumber: formData.phoneNumber,
            loyaltyPoints: formData.loyaltyPoints,
            tier: formData.tier,
            joinDate: formData.joinDate,
          },
        })
      ).unwrap();

      toast({
        title: "Customer Updated",
        description: "The customer details have been successfully updated.",
        variant: "success",
      });
      navigate("/admin/view-members");
    } catch (err) {
      toast({
        title: "Error Updating Customer",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="container max-w-full max-h-full">
        <div className="flex justify-center items-center h-screen">
          <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3 relative">
            <div className="bg-blue-50 opacity-95 rounded-lg p-8 border-blue-300 border-4">
              <h1 className="text-center text-3xl font-bold mb-4">
                Edit Member Details
              </h1>
              <hr className="border-slate-500 border-t-2 mx-auto w-4/5 mt-2" />
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onClick={() =>
                        toast({
                          title: "Email Cannot be Modified",
                          description:
                            "You may have to delete this account and create a new one",
                          variant: "destructive",
                        })
                      }
                      placeholder="Email"
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Loyalty Points
                    </label>
                    <input
                      type="number"
                      name="loyaltyPoints"
                      value={formData.loyaltyPoints}
                      onChange={handleChange}
                      placeholder="Loyalty Points"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Tier
                    </label>
                    <select
                      name="tier"
                      value={formData.tier}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    >
                      <option value="">Select a Tier</option>
                      {tierOptions.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-700">
                      Join Date
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => navigate("/admin/view-members")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMemberDetails;
