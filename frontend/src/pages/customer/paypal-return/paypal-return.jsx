import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchCartItems } from "@/redux/cartSlice";
import { capturePayment, resetApprovalURL } from "@/redux/orderSlice";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PayPalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { placedOrderId } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  dispatch(resetApprovalURL());

  useEffect(() => {
    console.log(placedOrderId);
    dispatch(
      capturePayment({ paymentId, payerId, orderId: placedOrderId })
    ).then((data) => {
      console.log(data);
      setOrder(data.payload.order);
      dispatch(resetApprovalURL());
      dispatch(fetchCartItems(user?._id));
    });
  }, [paymentId, payerId, placedOrderId, dispatch, navigate, user?._id]);

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
