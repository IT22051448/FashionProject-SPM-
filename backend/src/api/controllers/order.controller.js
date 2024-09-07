import Order from "../models/order.model";
import logger from "../../utils/logger";
import Product from "../models/product.model";
import Cart from "../models/cart.model";

const orderController = {
  async createOrder(req, res) {
    try {
      const {
        userId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
        cartId,
      } = req.body;

      //   const create_payment_json = {
      //     intent: "sale",
      //     payer: {
      //       payment_method: "paypal",
      //     },
      //     redirect_urls: {
      //       return_url: "http://localhost:5173/shop/paypal-return",
      //       cancel_url: "http://localhost:5173/shop/paypal-cancel",
      //     },
      //     transactions: [
      //       {
      //         item_list: {
      //           items: cartItems.map(item => ({
      //             name: item.title,
      //             sku: item.productId,
      //             price: item.price.toFixed(2),
      //             currency: "USD",
      //             quantity: item.quantity,
      //           })),
      //         },
      //         amount: {
      //           currency: "USD",
      //           total: totalAmount.toFixed(2),
      //         },
      //         description: "description",
      //       },
      //     ],
      //   };

      //   paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      //     if (error) {
      //       console.log(error);

      //       return res.status(500).json({
      //         success: false,
      //         message: "Error while creating paypal payment",
      //       });
      //     } else {

      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      });

      for (let item of newlyCreatedOrder.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for this product ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;

        await product.save();
      }

      const order = await newlyCreatedOrder.save();

      logger.info(`Order created successfully ${order._id}`);

      const getCartId = order.cartId;
      logger.info("cart deleted");
      await Cart.findByIdAndDelete(getCartId);

      res.status(201).json({
        success: true,
        // approvalURL,
        orderId: newlyCreatedOrder._id,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  },

  async capturePayemnt(req, res) {
    try {
      const { paymentId, payerId, orderId } = req.body;

      let order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order can not be found",
        });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;

      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for this product ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;

        await product.save();
      }

      const getCartId = order.cartId;
      logger.info("cart deleted");
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  },

  async getOrders(req, res) {
    try {
      if (req.user.role === "admin") {
        const orders = await Order.find();
        res.status(200).json(orders);
      } else if (req.user.role === "user") {
        const orders = await Order.find({ userId: req.user._id });
        res.status(200).json(orders);
      }
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getOrder(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { orderStatus: req.body.orderStatus },
        { new: true }
      );
      res.status(200).json(order);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async deleteOrder(req, res) {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default orderController;
