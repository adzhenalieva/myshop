const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const Categories = require('../models/Category');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    Categories.find()
        .then(categories => res.send(categories))
        .catch(() => res.sendStatus(500))
});

router.post('/', [auth, permit('admin'), upload.single('image')], (req, res) => {
    const categoryData = req.body;

    if (req.file) {
        categoryData.image = req.file.filename;
    }

    const category = new Categories(categoryData);
    category.save()
        .then(result => res.send(result))
        .catch(() => res.sendStatus(400).send(error))
});

module.exports = router;
