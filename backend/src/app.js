import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/db.connection";
import userRouter from "./api/routes/user.route";
import authRouter from "./api/routes/auth.route";
import orderRouter from "./api/routes/order.route";
import productRouter from "./api/routes/product.route";
import cartRouter from "./api/routes/cart.route";
import addressRouter from "./api/routes/address.route";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
  connect();
});
