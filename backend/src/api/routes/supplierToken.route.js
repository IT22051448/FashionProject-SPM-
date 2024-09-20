import express from "express";
import {
  addSupplierToken,
  validateToken,
} from "../controllers/supplierToken.controller";

const router = express.Router();

router.post("/add-supplier-token", addSupplierToken);
router.get("/validate-token/:token", async (req, res) => {
  const tokenToValidate = req.params.token;

  try {
    const result = await validateToken(tokenToValidate);

    if (result.valid) {
      res.status(200).json({
        message: "Token is valid!",
        data: result.data, // Return associated data
      });
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;