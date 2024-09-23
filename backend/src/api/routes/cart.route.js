import express from "express";
import cartController from "../controllers/cart.controller";
import authMiddleware from "../middleware/authMiddleware";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware(["user"]), cartController.addToCart);
cartRouter.get(
  "/get/:userId",
  authMiddleware(["user"]),
  cartController.fetchCartItems
);
cartRouter.put(
  "/update-cart",
  authMiddleware(["user"]),
  cartController.updateCartItemQty
);
cartRouter.delete(
  "/:userId/:productId",
  authMiddleware(["user"]),
  cartController.deleteCartItem
);

export default cartRouter;
