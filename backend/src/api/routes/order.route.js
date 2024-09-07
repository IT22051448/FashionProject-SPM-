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

export default orderRouter;
