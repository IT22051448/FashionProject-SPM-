import { imageUploadUtil } from "../../utils/cloudinary";
import logger from "../../utils/logger";
import { Buffer } from "buffer";
import Product from "../models/product.model";

const productController = {

  async getFilteredProducts (req, res) {
    try {
      const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
  
      let filters = {};
  
      if (category.length) {
        filters.category = { $in: category.split(",") };
      }
  
      if (brand.length) {
        filters.brand = { $in: brand.split(",") };
      }
  
      let sort = {};
  
      switch (sortBy) {
        case "price-lowtohigh":
          sort.price = 1;
  
          break;
        case "price-hightolow":
          sort.price = -1;
  
          break;
        case "title-atoz":
          sort.title = 1;
  
          break;
  
        case "title-ztoa":
          sort.title = -1;
  
          break;
  
        default:
          sort.price = 1;
          break;
      }
  
      const products = await Product.find(filters).sort(sort);
  
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (e) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Some error occured",
      });
    }
  };

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
        image,
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
      product.image=image || product.image;
      product.title = title || product.title;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.price = price === "" ? 0 :price || product.price;
      product.salePrice = salePrice === "" ? 0 :salePrice || product.salePrice;
      product.totalStock = totalStock || product.totalStock;

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
      const product = await Product.findByIdAndDelete(id);
  
      if (!product)
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
  
      res.status(200).json({
        success: true,
        message: "Product delete successfully",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }
  },
};

export default productController;
