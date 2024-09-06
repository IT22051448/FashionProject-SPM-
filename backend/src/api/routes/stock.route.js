import express from "express";

import { addStock,fetchStock } from "../controllers/stock.controller";

const router = express.Router();

router.post("/add-stock", addStock);
router.get("/fetch-stock", fetchStock);


export default router;
