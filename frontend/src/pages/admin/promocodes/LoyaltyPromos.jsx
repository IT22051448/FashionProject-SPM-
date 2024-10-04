import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPromoCode } from "@/redux/loyaltySlice/promoSlice";
import { promoFormControls } from "@/config/promoFormConfig";

const PromoCodes = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    tier: "",
    startDate: "",
    endDate: "",
    discountPercentage: "",
    discountAmount: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expiresAt = formData.endDate ? new Date(formData.endDate) : null;
    const discountPercentageValue = formData.discountPercentage
      ? parseFloat(formData.discountPercentage)
      : null;
    const discountAmountValue = formData.discountAmount
      ? parseFloat(formData.discountAmount)
      : null;

    const promoData = {
      ...formData,
      expiresAt,
      discountPercentage: discountPercentageValue,
      discountAmount: discountAmountValue,
    };

    try {
      await dispatch(createPromoCode(promoData)).unwrap();
      alert("Promo code created successfully!");
      navigate("/admin/view-promos");
    } catch (error) {
      console.error("Error creating promo code:", error);
      alert("Error creating promo code. Please try again.");
    }
  };

  const handleViewPromoCodes = () => {
    navigate("/admin/view-promos");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 border-2 border-black">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Create Promo Codes</h1>
          <button
            type="button"
            onClick={handleViewPromoCodes}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View All Promo Codes
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          {promoFormControls.map((control) => (
            <div className="mb-4" key={control.name}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {control.label}
              </label>
              {control.componentType === "input" && (
                <input
                  type={control.type}
                  name={control.name}
                  value={formData[control.name]}
                  onChange={handleChange}
                  placeholder={control.placeholder}
                  step={control.step}
                  className="w-full px-3 py-2 border rounded"
                  required={control.required}
                />
              )}
              {control.componentType === "select" && (
                <select
                  name={control.name}
                  value={formData[control.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required={control.required}
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Create Promo Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoCodes;
