import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/db.connection";
import userRouter from "./api/routes/user.route";
import authRouter from "./api/routes/auth.route";
import orderRouter from "./api/routes/order.route";
import stockRouter from "./api/routes/stock.route";
import mailRouter from "./api/routes/mail.route";
import supplierRouter from "./api/routes/supplier.route";

const PORT = process.env.PORT || 3000;

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
app.use("/api/orders", orderRouter);
app.use("/api/stock", stockRouter);
app.use("/api/sendmail", mailRouter);
app.use("/api/supplier", supplierRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
  console.log(`Server is running on port: ${PORT}`);

  connect();
});
