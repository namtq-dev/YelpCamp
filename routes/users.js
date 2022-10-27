const express = require('express');
const passport = require('passport');

const catchAsync = require('../helpers/catchAsync');

const User = require('../models/user');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
})

module.exports = router;
