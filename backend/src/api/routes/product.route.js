import { Router } from "express";
import productController from "../controllers/product.controller";
import { upload } from "../../utils/cloudinary";
import authMiddleware from "../middleware/authMiddleware";

const productRouter = Router();

productRouter.post(
  "/upload",
  upload.single("file"),
  productController.handleImageUpload
);

productRouter.post(
  "/add",
  authMiddleware(["admin"]),
  productController.addProduct
);

productRouter.get('', productController.getProducts);

productRouter.get("/:id", productController.getProduct);

productRouter.put("/:id", productController.updateProduct);

productRouter.delete("/:id",productController.deleteProduct);

productRouter.get("/get", productController.getFilteredProducts);



export default productRouter;
