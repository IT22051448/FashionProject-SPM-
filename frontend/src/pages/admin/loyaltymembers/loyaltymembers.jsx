import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCustomers,
  deleteCustomer,
  updateCustomerTier,
} from "@/redux/loyaltySlice/loyaltySlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PromotionModal from "../../../components/LoyaltyMemberComponents/PromotionModal";

const LoyaltyMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error } = useSelector((state) => state.loyalty);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleDelete = async (email) => {
    try {
      const resultAction = await dispatch(deleteCustomer(email));
      if (deleteCustomer.fulfilled.match(resultAction)) {
        toast({
          title: "Customer Deleted",
          description: "The customer has been successfully deleted.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Customer",
          description:
            resultAction.payload.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (email) => {
    navigate(`/admin/edit-customer/${email}`);
  };

  const handleGenerateReport = () => {
    navigate(`/admin/loyalty/generate-report`);
  };

  const handlePromote = async (count) => {
    const topCustomers = [...customers]
      .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
      .slice(0, count);

    topCustomers.forEach(async (customer) => {
      if (customer.tier !== "Diamond") {
        await dispatch(
          updateCustomerTier({ email: customer.email, newTier: "Diamond" })
        );
      }
    });

    toast({
      title: "Promotion Successful",
      description: `${count} top loyalty points holders have been promoted to Diamond Tier.`,
      variant: "success",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    const errorMessage =
      typeof error === "object" ? JSON.stringify(error) : error;
    return <div>Error: {errorMessage}</div>;
  }

  const sortedCustomers = [...customers].sort(
    (a, b) => b.loyaltyPoints - a.loyaltyPoints
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Loyalty Members</h1>
        <div className="flex gap-4">
          <Button
            onClick={handleGenerateReport}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Generate Report
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            Promote Diamond
          </Button>
        </div>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Loyalty Points</th>
            <th className="border px-4 py-2">Tier</th>
            <th className="border px-4 py-2">Successful Referrals</th>
            <th className="border px-4 py-2">Join Date</th>
            <th className="border px-4 py-2" colSpan="2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCustomers.map((customer) => (
            <tr key={customer.email} className="border-b">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">{customer.phoneNumber}</td>
              <td className="py-2 px-4 text-center">
                {customer.loyaltyPoints}
              </td>
              <td className="py-2 px-4 text-center">{customer.tier}</td>
              <td className="py-2 px-4 text-center">
                {customer.referredcount || 0}{" "}
              </td>
              <td className="py-2 px-4">
                {new Date(customer.joinDate).toLocaleDateString("en-GB")}
              </td>
              <td className="py-2 px-4">
                <Button
                  onClick={() => handleEdit(customer.email)}
                  className="bg-green-500 text-white hover:bg-green-600 w-full"
                >
                  Edit
                </Button>
              </td>
              <td className="py-2 px-4">
                <Button
                  onClick={() => handleDelete(customer.email)}
                  className="bg-red-500 text-white hover:bg-red-600 w-full"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PromotionModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onPromote={handlePromote}
      />
    </div>
  );
};

export default LoyaltyMembers;
