import Order from "../models/order.model";
import logger from "../../utils/logger";
import Product from "../models/product.model";
import Cart from "../models/cart.model";
import paypal from "../../utils/paypal";
import ExcelJs from "exceljs";
import easyinvoice from "easyinvoice";
import { Buffer } from "buffer";

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

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:5173/shop/paypal-return",
          cancel_url: "http://localhost:5173/shop/paypal-cancel",
        },
        transactions: [
          {
            item_list: {
              items: cartItems.map(item => ({
                name: item.title,
                sku: item.productId,
                price: item.price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: totalAmount.toFixed(2),
            },
            description: "description",
          },
        ],
      };

      paypal.payment.create(
        create_payment_json,
        async function (error, payment) {
          if (error) {
            logger.error(error);

            return res.status(500).json({
              success: false,
              message: "Error while processing payment",
            });
          } else {
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

            const order = await newlyCreatedOrder.save();

            const approvalURL = payment.links.find(
              link => link.rel === "approval_url"
            ).href;

            res.status(201).json({
              success: true,
              approvalURL,
              orderId: order._id,
            });
          }
        }
      );
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
        order: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  },

  async cancelPayments(req, res) {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        res.status(400).json({
          success: false,
          message: "Order ID not sent in request",
        });
      }
      logger.info(orderId);
      await Order.findByIdAndDelete({ _id: orderId });

      res.status(200).json({
        success: true,
        message: "Temporary order deleted successfully",
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  async deleteOrder(req, res) {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
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

  async generateOrderReport(req, res) {
    try {
      const workbook = new ExcelJs.Workbook();
      const orders = await Order.find();

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No orders found",
        });
      }

      const sheet = workbook.addWorksheet("Orders");

      sheet.columns = [
        { header: "Order Number", key: "orderNumber", width: 20 },
        { header: "User ID", key: "userId", width: 25 },
        { header: "Total Amount", key: "totalAmount", width: 15 },
        { header: "Order Date", key: "orderDate", width: 20 },
        { header: "Order Status", key: "orderStatus", width: 20 },
        { header: "Payment Status", key: "paymentStatus", width: 20 },
        { header: "Address", key: "addressInfo", width: 30 },
      ];

      // Add rows with data from orders
      orders.forEach(order => {
        sheet.addRow({
          orderNumber: order.orderNumber,
          userId: order.userId,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          addressInfo: `${order.addressInfo.address}, ${order.addressInfo.city}, ${order.addressInfo.pincode}`,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="orders_report.xlsx"'
      );

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error("Error generating order report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate order report",
      });
    }
  },

  async generateInvoice(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      const invoiceData = {
        documentTitle: "ORDER REPORT",
        currency: "USD",
        mode: "development",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        sender: {
          company: "Fashion",
          address: "Your Address",
          zip: "12345",
          city: "Your City",
        },
        client: {
          address: order.addressInfo.address,
          zip: order.addressInfo.pincode,
          city: order.addressInfo.city,
        },
        invoiceNumber: "2021.0001",
        invoiceDate: new Date().toLocaleDateString(),
        products: order.cartItems?.map(product => ({
          quantity: product.quantity,
          description: product.title,
          price: product.price,
        })),
        bottomNotice: "Thank you for your business.",
      };

      const result = await easyinvoice.createInvoice(invoiceData);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.send(Buffer.from(result.pdf, "base64"));
    } catch (error) {
      logger.error("Error generating invoice:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate invoice",
      });
    }
  },
};

export default orderController;
