import Address from "./address";
import img from "@/assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/layouts/customer/components/cart-items";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/redux/orderSlice";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { updateLoyaltyPoints } from "@/redux/loyaltySlice/loyaltySlice";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.order);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isTestOrder, setIsTestOrder] = useState(false);
  const { tier } = useSelector((state) => state.loyalty);
  const [previousTier, setPreviousTier] = useState(tier);
  const [promoCode, setPromoCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountText, setDiscountText] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  useEffect(() => {
    // Update discounted total based on promo code
    setDiscountedTotal(totalCartAmount);
  }, [totalCartAmount]);

  useEffect(() => {
    // Check for applied promo code in sessionStorage
    const storedPromoCode = sessionStorage.getItem("appliedPromoCode");
    if (storedPromoCode) {
      setPromoCode(storedPromoCode);
      applyPromoCode(storedPromoCode); // Automatically apply the promo code
      sessionStorage.removeItem("appliedPromoCode"); // Clear promo code from sessionStorage
    }
  }, []);

  async function applyPromoCode() {
    if (!promoCode) {
      toast({
        title: "Please enter a promo code",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/loyalty/apply-promo-code",
        {
          code: promoCode,
        }
      );
      const { discountPercentage, discountAmount } = response.data;

      let discount = 0;

      if (discountPercentage) {
        discount = (totalCartAmount * discountPercentage) / 100;
        setDiscountText(`${discountPercentage}% OFF applied`);
      } else if (discountAmount) {
        discount = discountAmount;
        setDiscountText(`${discountAmount} Rs OFF applied`);
      } else {
        toast({
          title: "Invalid promo code",
          variant: "destructive",
        });
        return;
      }
      setDiscountedTotal(totalCartAmount - discount);
      setPromoApplied(true);
      toast({
        title: "Discount applied successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error applying promo code",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: discountedTotal,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "order creation succesfull");
      if (data?.payload?.success) {
        console.log("Payment started");
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  function handleTestOrder() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "test", // Set payment method to 'test'
      paymentStatus: "completed", // Set payment status to 'completed'
      totalAmount: discountedTotal,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "test-payment-id",
      payerId: "test-payer-id",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Test Order Placed Successfully!",
          variant: "success",
        });
        handlePaymentCompletion(user.email, discountedTotal);
        setIsTestOrder(true);
      } else {
        toast({
          title: "Test Order Failed.",
          variant: "destructive",
        });
        setIsTestOrder(false);
      }
    });
  }

  // Effect to handle redirection based on the state
  useEffect(() => {
    if (isPaymentStart && approvalURL) {
      window.location.href = approvalURL;
    }
  }, [isPaymentStart, approvalURL]);

  const handlePaymentCompletion = (email, total) => {
    const points = Math.floor(total / 10);

    // Dispatch the action to update loyalty points
    dispatch(updateLoyaltyPoints({ email, points })).then((action) => {
      // Display the points added message regardless of tier change
      toast({
        title: `Points Added!`,
        description: `${points} points have been added to your loyalty account.`,
        variant: "success",
      });

      // Check if the tier has changed and display the tier change message
      if (
        action.payload &&
        action.payload.tier &&
        action.payload.tier !== previousTier
      ) {
        toast({
          title: `Congratulations!`,
          description: `You have been promoted to the ${action.payload.tier} tier!`,
          variant: "success",
        });
        setPreviousTier(action.payload.tier); // Update the previous tier to the new tier
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item, index) => (
                <UserCartItemsContent key={index} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${discountedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code Section */}
          {!promoApplied && (
            <div className="flex gap-4 mb-8">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              <Button onClick={applyPromoCode} className="flex-shrink-0">
                Apply
              </Button>
            </div>
          )}
          {promoApplied && (
            <p className="text-green-600 font-semibold">{discountText}</p>
          )}

          {/* Checkout Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full flex items-center gap-5"
            >
              {isPaymentStart && <Spinner className="text-white" />}
              {isPaymentStart ? "Processing Payment" : "Checkout with Paypal"}
            </Button>
            <Button
              onClick={handleTestOrder}
              className="w-full flex items-center gap-5 bg-green-500"
            >
              {isTestOrder && <Spinner className="text-white" />}
              {isTestOrder ? "Test Order Placed" : "Place Test Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
