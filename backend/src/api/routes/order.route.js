import { Router } from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.get("/", authMiddleware(["admin"]), orderController.getOrders);
orderRouter.post("/", authMiddleware(["user"]), orderController.createOrder);

export default orderRouter;
