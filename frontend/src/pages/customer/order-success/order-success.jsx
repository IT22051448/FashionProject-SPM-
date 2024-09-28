import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrder, resetPlacedOrderId } from "@/redux/orderSlice";
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
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
