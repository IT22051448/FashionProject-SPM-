import { Router } from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middleware/authMiddleware";

const orderRouter = Router();
orderRouter.post("/", authMiddleware(["user"]), orderController.createOrder);
orderRouter.get(
  "/",
  authMiddleware(["admin", "user"]),
  orderController.getOrders
);
orderRouter.get(
  "/gen-report",
  authMiddleware(["admin"]),
  orderController.generateOrderReport
);
orderRouter.get(
  "/:id",
  authMiddleware(["admin", "user"]),
  orderController.getOrder
);
orderRouter.put(
  "/:id",
  authMiddleware(["admin"]),
  orderController.updateOrderStatus
);
orderRouter.delete(
  "/:id",
  authMiddleware(["admin"]),
  orderController.deleteOrder
);
orderRouter.post(
  "/capture-payment",
  authMiddleware(["user"]),
  orderController.capturePayemnt
);
orderRouter.post(
  "/cancel-payment",
  authMiddleware(["user"]),
  orderController.cancelPayments
);

export default orderRouter;
