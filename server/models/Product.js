const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    description: String,
    image: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
