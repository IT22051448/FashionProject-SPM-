import { imageUploadUtil } from "../../utils/cloudinary";
import logger from "../../utils/logger";
import { Buffer } from "buffer";
import Product from "../models/product.model";

const productController = {
  async handleImageUpload(req, res) {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const url = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await imageUploadUtil(url);

      logger.info(`Image uploaded successfully: ${result.url}`);
      return res.status(200).json({ success: true, result });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  async addProduct(req, res) {
    try {
      const {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      } = req.body;

      const product = new Product({
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      });

      await product.save();
      logger.info(`Product added successfully: ${product}`);

      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        product: product,
      });
    } catch (error) {
      logger.error(error.message);

      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  async getProducts(req, res) {
    try {
      const products = await Product.find();

      logger.info(`Products fetched successfully`);

      return res.status(200).json({ success: true, products });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      logger.info(`Product fetched successfully: ${product}`);

      return res.status(200).json({ success: true, product });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      } = req.body;

      const product = await Product.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      product.title = title;
      product.description = description;
      product.category = category;
      product.brand = brand;
      product.price = price;
      product.salePrice = salePrice;
      product.totalStock = totalStock;

      await product.save();
      logger.info(`Product updated successfully: ${product}`);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: product,
      });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      await product.remove();
      logger.info(`Product deleted successfully: ${product}`);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        id: id,
      });
    } catch (error) {
      logger.error(error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
};

export default productController;
