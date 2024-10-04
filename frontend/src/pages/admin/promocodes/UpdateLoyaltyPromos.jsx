// src/components/UpdateLoyaltyPromos.js

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromoCodeById,
  updatePromoCode,
} from "@/redux/loyaltySlice/promoSlice"; // Adjust the import path
import { promoFormControls } from "@/config/promoFormConfig";
import { useForm } from "react-hook-form";

const UpdateLoyaltyPromos = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { promoCode, loading, error } = useSelector((state) => state.promo);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchPromoCodeById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (promoCode) {
      setValue("code", promoCode.code);
      setValue("description", promoCode.description);
      setValue("tier", promoCode.tier);
      setValue(
        "startDate",
        promoCode.startDate
          ? new Date(promoCode.startDate).toISOString().split("T")[0]
          : ""
      );
      setValue(
        "expiresAt",
        promoCode.expiresAt
          ? new Date(promoCode.expiresAt).toISOString().split("T")[0]
          : ""
      );
      setValue("discountPercentage", promoCode.discountPercentage);
      setValue("discountAmount", promoCode.discountAmount);
    }
  }, [promoCode, setValue]);

  const onSubmit = (data) => {
    const promoData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      discountPercentage: data.discountPercentage
        ? parseFloat(data.discountPercentage)
        : null,
      discountAmount: data.discountAmount
        ? parseFloat(data.discountAmount)
        : null,
    };

    dispatch(updatePromoCode({ id, promoData }))
      .unwrap()
      .then(() => {
        alert("Promo code updated successfully!");
        navigate("/admin/view-promos");
      })
      .catch(() => {
        alert("Error updating promo code. Please try again.");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 mb-4">{error}</div>;

  return (
    <div className="container mx-auto p-4 border-2 border-black">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Update Promo Code</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md"
      >
        {promoFormControls.map((control) => (
          <div className="mb-4" key={control.name}>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {control.label}
            </label>
            {control.componentType === "input" && (
              <input
                {...register(control.name, { required: control.required })}
                type={control.type}
                placeholder={control.placeholder}
                step={control.step}
                className={`w-full px-3 py-2 border rounded ${
                  errors[control.name] ? "border-red-500" : ""
                }`}
              />
            )}
            {control.componentType === "select" && (
              <select
                {...register(control.name, { required: control.required })}
                className={`w-full px-3 py-2 border rounded ${
                  errors[control.name] ? "border-red-500" : ""
                }`}
              >
                {control.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {errors[control.name] && (
              <span className="text-red-500 text-sm">{`${control.label} is required`}</span>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Update Promo Code
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/view-promos")}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLoyaltyPromos;
