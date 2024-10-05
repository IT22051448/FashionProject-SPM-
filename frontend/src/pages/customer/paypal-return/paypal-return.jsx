import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capturePayment, resetApprovalURL, getOrder } from "@/redux/orderSlice";
import { fetchCartItems } from "@/redux/cartSlice";
import { updateLoyaltyPoints } from "@/redux/loyaltySlice/loyaltySlice";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PayPalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { placedOrderId, orderDetails } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
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
  }, [placedOrderId, dispatch, orderFetched, orderDetails]);

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
        .then((data) => {
          console.log("Payment captured successfully.");
          setOrder(data.payload.order);
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
    user?._id,
    pointsAdded,
    previousTier,
    toast,
    user.email, // For triggering notifications
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Order created Successfully</CardTitle>
          <CardDescription>
            Thank you for your order. Your order has been placed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <div className="flex mt-6 items-center justify-between">
                <p className="font-medium">Order ID</p>
                <Label>{order?._id}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Date</p>
                <Label>{order?.orderDate.split("T")[0]}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Order Price</p>
                <Label>${order?.totalAmount}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Payment method</p>
                <Label>{order?.paymentMethod}</Label>
              </div>
              <div className="flex mt-2 items-center justify-between">
                <p className="font-medium">Payment Status</p>
                <Label>{order?.paymentStatus}</Label>
              </div>
              <Button
                onClick={() => {
                  navigate("/shop/profile");
                }}
              >
                View Orders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayPalReturn;
