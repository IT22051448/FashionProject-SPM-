import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import connect from "./utils/db.connection";
import userRouter from "./api/routes/user.route";
import authRouter from "./api/routes/auth.route";


const PORT =  process.env.PORT ||5000;

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    logger.info(`Server is running on port: ${PORT}`);
    connect();
});