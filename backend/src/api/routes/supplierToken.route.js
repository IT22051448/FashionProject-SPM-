import express from "express";
import {
  addSupplierToken,
  validateToken,
  fetchStockOrders,
} from "../controllers/supplierToken.controller";

const router = express.Router();

router.post("/add-supplier-token", addSupplierToken);
router.get("/fetch-stock-orders", fetchStockOrders);
router.get("/validate-token/:token", async (req, res) => {
  const tokenToValidate = req.params.token;

  try {
    const result = await validateToken(tokenToValidate);

    if (result.valid) {
      res.status(200).json({
        message: "Token is valid!",
        data: result.token, // Return the token object
      });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
