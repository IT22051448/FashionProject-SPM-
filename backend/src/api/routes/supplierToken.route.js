import express from "express";
import {
  addSupplierToken,
  validateToken,
  fetchStockOrders,
  updateTokenStatus,
} from "../controllers/supplierToken.controller";

const router = express.Router();

router.post("/add-supplier-token", addSupplierToken);
router.get("/fetch-stock-orders", fetchStockOrders);
router.patch("/update-token-status/:tokenId", async (req, res) => {
  try {
    const token = req.params.tokenId;
    const { status } = req.body;

    const result = await updateTokenStatus(token, status);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


});



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
