import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex1 items-center justify-center ">
      <Card>
        <CardHeader>
          <CardTitle>Processing Payment...Please wait!</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default OrderSuccess;
