import mongoose from 'mongoose';
import logger from "../../utils/logger";

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    subTotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    discountCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'cash on delivery'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    paymentDate: {
        type: Date
    },
});

OrderSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            
            const prevOrder = await mongoose.model('Order').findOne().sort({ _id: -1 });

            if (!prevOrder) {
                this.orderNumber = 'ORD000001';
                return next();
            }
    
            // generate new order number = prev order number + 1
            const prevOrderNumber = prevOrder.orderNumber;
            const orderNumber = parseInt(prevOrderNumber.split('ORD')[1]) + 1;
    
            this.orderNumber = `ORD${orderNumber.toString().padStart(6, '0')}`;
            // logger.info(`Order number ${this.orderNumber} generated`);
        }
            
        return next();

    } catch (error) {
        logger.error("error", error.message);
        return next(error);
    }
})

const Order = mongoose.model('Order', OrderSchema);

export default Order;
 
