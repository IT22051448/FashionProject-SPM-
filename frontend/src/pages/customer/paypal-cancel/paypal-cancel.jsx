import { toast } from "@/hooks/use-toast";
import { cancelPayment, resetApprovalURL } from "@/redux/orderSlice";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

const PayPalCancel = () => {
  const { placedOrderId } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cancelPayment({ orderId: placedOrderId })).then((data) => {
      console.log(data);
      if (data?.payload?.success) {
        toast({
          title: "Payment cancelled",
        });
      }
      dispatch(resetApprovalURL());
    });
  });

  return <div>Cancel Payment</div>;
};

export default PayPalCancel;
