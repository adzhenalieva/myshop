const express = require('express');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();


const findNumber = (item, array) => {
    return array.reduce(function (sum, current) {
        return sum + parseFloat(current[item]);
    }, 0);
};

router.get('/', auth, (req, res) => {
    Order.find({user: req.user._id})
        .then(result => res.send(result))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', auth, (req, res) => {
    Order.findById(req.params.id)
        .then(result => res.send(result))
        .catch(() => res.sendStatus(500))
});

router.put('/:id', auth, permit('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.status = "delivered";

        return res.status(201).send(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const listOfProducts =  await Promise.all(req.body.data.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
                productId: product._id,
                quantity: item.quantity,
                title: product.title,
                price: product.price
            }
        }));

        const order = await Order.create({
            user: req.user._id,
            order: listOfProducts,
            quantity: findNumber('quantity', listOfProducts),
            totalPrice: findNumber('price', listOfProducts)
        });

        return res.status(201).send(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;
