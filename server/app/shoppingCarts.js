const express = require('express');
const auth = require('../middleware/auth');
const ShoppingCart = require('../models/ShoppingCart');
const Product = require('../models/Product');

const router = express.Router();


const findNumber = (item, array) => {
    return array.reduce(function (sum, current) {
        return sum + current[item];
    }, 0);
};

router.get('/', auth, (req, res) => {
    ShoppingCart.findOne({user: req.user._id})
        .then(result => res.send(result))
        .catch(() => res.sendStatus(500))
});


router.put('/', auth, async (req, res) => {
    try {
        let cart = await ShoppingCart.findOne({user: req.user._id});
        cart.products = [];
        cart.quantity = 0;
        cart.totalPrice = 0;
        await cart.save();
        return res.status(201).send(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post('/', auth, async (req, res) => {

    try {
        let cart = await ShoppingCart.findOne({user: req.user._id});
        let product  = await Product.findById(req.body.productId);
        if (cart) {
            let itemIndex = cart.products.findIndex(p => p.productId.equals(product._id));

            if (itemIndex > -1) {
                let productItem = cart.products[itemIndex];
                productItem.quantity = parseFloat(productItem.quantity) + parseFloat(req.body.quantity);
                productItem.price = parseFloat(productItem.price) + parseFloat(product.price);
                cart.products[itemIndex] = productItem;
                cart.quantity = findNumber('quantity', cart.products);
                cart.totalPrice = findNumber('price', cart.products);

            } else {
                const newProductItem = {
                    productId: product._id,
                    quantity: req.body.quantity,
                    title: product.title,
                    price: product.price
                };
                cart.products.push(newProductItem);
                cart.quantity = findNumber('quantity', cart.products);
                cart.totalPrice = findNumber('price', cart.products);
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newProductItem = {
                productId: product._id,
                quantity: req.body.quantity,
                title: product.title,
                price: product.price
            };
            const newCart = await ShoppingCart.create({
                user: req.user._id,
                products: [newProductItem],
                quantity: req.body.quantity,
                totalPrice: product.price
            });

            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
