const express = require('express');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const Order = require('../models/Order');

const router = express.Router();


const findNumber = (item, array) => {
    return array.reduce(function (sum, current) {
        return sum + current[item];
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
        const {productId, quantity, title, price} = req.body;

        const order = await Order.create({
            user: req.user._id,
            products: [{productId, quantity, title, price}],
            quantity: findNumber('quantity'),
            totalPrice: findNumber('price')
        });

        return res.status(201).send(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;
