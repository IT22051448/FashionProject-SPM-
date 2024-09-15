import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment, resetApprovalURL, getOrder } from "@/redux/orderSlice";
import { fetchCartItems } from "@/redux/cartSlice";
import { updateLoyaltyPoints } from "@/redux/loyaltySlice/loyaltySlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PayPalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { placedOrderId, orderDetails } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const { tier } = useSelector((state) => state.loyalty);
  const [previousTier, setPreviousTier] = useState(tier);
  const [pointsAdded, setPointsAdded] = useState(false); // Flag to prevent multiple updates
  const [orderFetched, setOrderFetched] = useState(false);
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  // Fetch order details only once
  useEffect(() => {
    if (placedOrderId && !orderFetched) {
      dispatch(getOrder(placedOrderId))
        .then(() => {
          console.log("Order details fetched:", orderDetails);
          setOrderFetched(true); // Mark order as fetched
        })
        .catch((error) => {
          console.error("Failed to fetch order details:", error);
        });
    }
  }, [placedOrderId, dispatch, orderFetched]);

  // Handle payment and loyalty points logic
  useEffect(() => {
    if (
      paymentId &&
      payerId &&
      placedOrderId &&
      orderFetched &&
      !pointsAdded &&
      orderDetails
    ) {
      dispatch(capturePayment({ paymentId, payerId, orderId: placedOrderId }))
        .then(() => {
          console.log("Payment captured successfully.");
          dispatch(resetApprovalURL());
          dispatch(fetchCartItems(user?._id));

          const totalAmount = orderDetails.totalAmount;
          const points = Math.floor(totalAmount / 10);

          console.log("Calculated points:", points);

          if (isNaN(points) || points <= 0) {
            console.error("Invalid points value:", points);
            alert("An error occurred while calculating points.");
            return;
          }

          // Update loyalty points
          dispatch(updateLoyaltyPoints({ email: user.email, points }))
            .then((action) => {
              console.log("Loyalty points updated. Response:", action);
              setPointsAdded(true); // Set flag to prevent further updates

              // Show toast for points added
              toast({
                title: "Points Added!",
                description: `${points} points have been added to your loyalty account.`,
                variant: "success",
              });

              // Check for tier change and show promotion message if tier changes
              if (
                action.payload &&
                action.payload.tier &&
                action.payload.tier !== previousTier
              ) {
                // Update the previous tier
                setPreviousTier(action.payload.tier);

                // Show toast for tier promotion
                toast({
                  title: "Congratulations!",
                  description: `You have been promoted to the ${action.payload.tier} tier!`,
                  variant: "success",
                });
              }

              // Navigate to order success page after points and tier update
              navigate("/shop/order-success");
            })
            .catch((error) => {
              console.error("Failed to update loyalty points:", error);
              toast({
                title: "Error",
                description: "Failed to update loyalty points.",
                variant: "destructive",
              });
            });
        })
        .catch((error) => {
          console.error("Failed to capture payment:", error);
          navigate("/shop/order-failure");
        });
    }
  }, [
    paymentId,
    payerId,
    placedOrderId,
    orderFetched,
    orderDetails,
    dispatch,
    navigate,
    user,
    pointsAdded,
    previousTier,
    toast, // For triggering notifications
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Placed Order ID: {placedOrderId}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PayPalReturn;
