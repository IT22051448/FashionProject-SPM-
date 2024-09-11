import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCartItems } from "@/redux/cartSlice";
import { capturePayment, resetApprovalURL } from "@/redux/orderSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PayPalReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { placedOrderId } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

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
      dispatch(resetApprovalURL());
      dispatch(fetchCartItems(user?._id));

      navigate("/shop/order-success");
    });
  }, [paymentId, payerId, placedOrderId, dispatch, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle> placed order ID: {placedOrderId}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PayPalReturn;
