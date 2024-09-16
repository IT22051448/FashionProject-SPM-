import express from "express";

import { addStock,fetchStock ,fetchLowStocks,deleteStock} from "../controllers/stock.controller";

const router = express.Router();

router.post("/add-stock", addStock);
router.get("/fetch-stock", fetchStock);
router.get("/fetch-low", fetchLowStocks);
router.delete("/delete-stock/:id", deleteStock);



export default router;
