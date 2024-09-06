import { Router } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post(
  "/check-auth",
  authMiddleware(["admin", "user"]),
  authController.checkAuth
);

// Add the logout route
authRouter.post("/logout", authController.logout);

export default authRouter;
