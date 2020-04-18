const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            title: String,
            price: Number
        }
    ],
    status: {
        type: String,
        enum: ["ordered", "delivered"],
        default: "new"
    },
    quantity: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
