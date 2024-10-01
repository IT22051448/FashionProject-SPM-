import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrder, resetPlacedOrderId } from "@/redux/orderSlice";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();

  const orderId = useSelector((state) => state.order.placedOrderId);

  dispatch(getOrder({ orderId })).then((data) => {
    if (data?.payload?.success) {
      setOrder(data?.payload?.order);
      resetPlacedOrderId();
    }
  });

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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
