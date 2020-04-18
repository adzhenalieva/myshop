const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
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
    quantity: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
});

const ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema);
module.exports = ShoppingCart;
