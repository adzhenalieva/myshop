const express = require('express');
const User = require('../models/User');
const bcrypt = require("bcrypt");

const router = express.Router();

router.post('/', (req, res) => {
    const user = new User({
        email: req.body.email,
        address: req.body.address,
        username: req.body.username,
        password: req.body.password
    });

    user.generateToken();
    user.save()
        .then(user => res.send({message: 'user registered', user}))
        .catch(error => res.status(400).send(error))
});

router.delete('/sessions', async (req, res) => {
    const token = req.get('Token');
    const success = {message: 'Success'};

    if (!token) {
        return res.send(success);
    }
    const user = await User.findOne({token});

    if (!user) {
        return res.send(success);
    }

    user.generateToken();
    user.save();

    return res.send(success);
});

router.put('/', async (req, res) => {
    req.user.password = req.body.password;
    await req.user.save();

    return res.sendStatus(200);
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.status(400).send({error: 'User not found'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Password is wrong'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Login successful', user});
});

module.exports = router;
