// src/components/UpdateLoyaltyPromos.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromoCodeById,
  updatePromoCode,
} from "@/redux/loyaltySlice/promoSlice";
import { promoFormControls } from "@/config/promoFormConfig";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const UpdateLoyaltyPromos = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { promoCode, loading, error } = useSelector((state) => state.promo);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm();

  const [discountError, setDiscountError] = useState("");

  const discountAmount = watch("discountAmount");
  const discountPercentage = watch("discountPercentage");

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

  const validateFields = () => {
    if (!discountAmount && !discountPercentage) {
      setDiscountError(
        "Either discount amount or percentage must be provided."
      );
      return false;
    }
    if (discountAmount && discountPercentage) {
      setDiscountError("You cannot input both discount amount and percentage.");
      return false;
    }
    setDiscountError("");
    return true;
  };

  const onSubmit = (data) => {
    if (!validateFields()) return;

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
        toast({
          title: "Success!",
          description: "Promo code updated successfully.",
          variant: "success",
        });
        navigate("/admin/view-promos");
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update promo code. Please try again.",
          variant: "error",
        });
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
                readOnly={
                  (control.name === "discountAmount" && discountPercentage) ||
                  (control.name === "discountPercentage" && discountAmount)
                }
                onClick={() => {
                  if (control.name === "discountAmount" && discountPercentage) {
                    setDiscountError(
                      "You cannot input a discount amount since percentage is already provided."
                    );
                  } else if (
                    control.name === "discountPercentage" &&
                    discountAmount
                  ) {
                    setDiscountError(
                      "You cannot input a discount percentage since amount is already provided."
                    );
                  }
                }}
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
        {discountError && (
          <p className="text-red-500 text-sm mb-4">{discountError}</p>
        )}

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
