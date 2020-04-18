const express = require('express');
const auth = require('../middleware/auth');
const ShoppingCart = require('../models/ShoppingCart');

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
    const {productId, quantity, name, price} = req.body;

    try {
        let cart = await ShoppingCart.findOne({user: req.user._id});
        if (cart) {
            let itemIndex = cart.products.findIndex(p => p.productId === productId);

            if (itemIndex > -1) {
                let productItem = cart.products[itemIndex];
                productItem.quantity = quantity;
                cart.products[itemIndex] = productItem;
                cart.quantity = findNumber('quantity');
                cart.totalPrice = findNumber('price');

            } else {
                cart.products.push({productId, quantity, name, price});
                cart.quantity = findNumber('quantity');
                cart.totalPrice = findNumber('price');
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newCart = await ShoppingCart.create({
                user: req.user._id,
                products: [{productId, quantity, name, price}],
                quantity: findNumber('quantity'),
                totalPrice: findNumber('price')
            });

            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
