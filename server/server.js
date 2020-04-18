const express = require('express');
const products = require('./app/products');
const categories = require('./app/categories');
const users = require('./app/users');
const orders = require('./app/orders');
const subcategories = require('./app/subcategories');
const shoppingCarts = require('./app/shoppingCarts');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');
const app = express();

const port = 8000;
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

mongoose.connect(config.dbURL, config.mongoOptions).then(() => {
    app.use('/products', products);
    app.use('/categories', categories);
    app.use('/users', users);
    app.use('/orders', orders);
    app.use('/carts', shoppingCarts);
    app.use('/subcategories', subcategories);

    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    })
});
