const express = require('express');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');

const Subcategory = require('../models/Subcategory');

const router = express.Router();

router.get('/', (req, res) => {
    Subcategory.find()
        .then(subcategories => res.send(subcategories))
        .catch(() => res.sendStatus(500))
});

router.post('/', [auth, permit('admin')], (req, res) => {
    const category = new Subcategory(req.body);
    category.save()
        .then(result => res.send(result))
        .catch(() => res.sendStatus(400).send(error))
});

module.exports = router;
