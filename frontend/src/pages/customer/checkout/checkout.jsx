import Address from "./address";
import img from "@/assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/layouts/customer/components/cart-items";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/redux/orderSlice";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { applyPromoCode } from "@/redux/loyaltySlice/loyaltySlice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountText, setDiscountText] = useState("");
  const { isLoyaltyCustomer } = useSelector((state) => state.loyalty);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

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
    setDiscountedTotal(totalCartAmount);
  }, [totalCartAmount]);

  useEffect(() => {
    const storedPromoCode = sessionStorage.getItem("appliedPromoCode");
    if (storedPromoCode) {
      setPromoCode(storedPromoCode);
      sessionStorage.removeItem("appliedPromoCode");
    }
  }, []);

  async function applyPromoCodeHandler() {
    if (!isLoyaltyCustomer) {
      toast({
        title: "Sorry, For Loyalty Members Only!",
        description: "Sign Up today to enjoy exclusive benefits",
        variant: "destructive",
      });
      return;
    }

    if (!promoCode) {
      toast({
        title: "Promo Code Required",
        description:
          "Please select Promotion codes from the Loyalty Profile Page",
        variant: "destructive",
      });
      return;
    }

    const hasSaleItems = cartItems.items.some(
      (item) => item.salePrice && item.salePrice > 0
    );

    if (hasSaleItems) {
      toast({
        title: "Promo codes cannot be used with sale items.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultAction = await dispatch(applyPromoCode(promoCode));
      if (applyPromoCode.fulfilled.match(resultAction)) {
        const { discountPercentage, discountAmount } = resultAction.payload;

        let discount = 0;

        if (discountPercentage) {
          discount = (totalCartAmount * discountPercentage) / 100;
          setDiscountText(`${discountPercentage}% OFF applied`);
        } else if (discountAmount) {
          discount = discountAmount;
          setDiscountText(`${discountAmount} OFF applied`);
        } else {
          toast({
            title: "Invalid promo code",
            variant: "destructive",
          });
          return;
        }

        const newTotal = totalCartAmount - discount;

        if (newTotal < 0) {
          toast({
            title: "Cannot apply promo code",
            description: "Discount amount exceeds the total amount.",
            variant: "destructive",
          });
          return;
        }

        setDiscountedTotal(newTotal);
        setPromoApplied(true);
        toast({
          title: "Discount applied successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error applying promo code",
          description: resultAction.payload.message,
          variant: "destructive",
        });
      }
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
        price: promoApplied
          ? (singleCartItem?.salePrice || singleCartItem?.price) *
            (discountedTotal / totalCartAmount)
          : singleCartItem?.salePrice > 0
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
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
      totalAmount: discountedTotal,
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  useEffect(() => {
    if (isPaymentStart && approvalURL) {
      window.location.href = approvalURL;
    }
  }, [isPaymentStart, approvalURL]);

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
                readOnly
              />
              <Button onClick={applyPromoCodeHandler} className="flex-shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
