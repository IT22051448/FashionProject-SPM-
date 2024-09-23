import mongoose from "mongoose";
import logger from "../../utils/logger";

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

OrderSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const prevOrder = await mongoose
        .model("Order")
        .findOne()
        .sort({ _id: -1 });

      if (!prevOrder) {
        this.orderNumber = "ORD000001";
        return next();
      }

      // generate new order number = prev order number + 1
      const prevOrderNumber = prevOrder.orderNumber;
      const orderNumber = parseInt(prevOrderNumber.split("ORD")[1]) + 1;

      this.orderNumber = `ORD${orderNumber.toString().padStart(6, "0")}`;
      // logger.info(`Order number ${this.orderNumber} generated`);
    }

    return next();
  } catch (error) {
    logger.error("error", error.message);
    return next(error);
  }
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
