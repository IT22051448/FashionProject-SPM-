import Order from "../models/order.model";
import logger from "../../utils/logger";

const orderController = {
    async createOrder(req, res) {
        try {
            const order = new Order({
                user: req.user._id,
                products: req.body.products,
                subTotal: req.body.subTotal,
                shipping: req.body.shipping,
                discount: req.body.discount,
                discountCode: req.body.discountCode,
                deliveryDate: req.body.deliveryDate,
                status: req.body.status,
                deliveryAddress: req.body.deliveryAddress,
                paymentMethod: req.body.paymentMethod,
                paymentStatus: req.body.paymentStatus,
                paymentDate: req.body.paymentDate
            });

            const savedOrder = await order.save();
            logger.info(`${savedOrder._id} order created`);
            res.status(201).json(savedOrder);

        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getOrders(req, res) {
        try {
            if (req.user.role === 'admin') {
                const orders = await Order.find();
                res.status(200).json(orders);
            } else if (req.user.role === 'user') {
                const orders = await Order.find({ user: req.user._id });
                res.status(200).json(orders);
            }

        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default orderController;