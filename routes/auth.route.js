const router = require('express').Router()
const User = require('../models/user.model')
const passport = require('passport')

router.get('/login', async (req, res, next) => {
    res.render('login')
})

router.get('/register', async (req, res, next) => {
    console.log("Rendering register page");
    res.render('register')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.post('/register', async (req, res, next) => {
    console.log("Inside POST request");
    try {
        // console.log(req.body)
        const email = req.body.email
        console.log("EMAIL OF THE USER: ", email);
        const doesExit = await User.findOne({ email })
        console.log("doesExist:", doesExit);
        if (doesExit) {
            console.log("It does exist!");
            res.redirect('/auth/register')
            return
        }
        const user = new User(req.body);
        console.log("User Object: ", user);
        await user.save()
        res.redirect('/auth/login')
    } catch (e) {
        // handled by error handler
        next(e)
    }
})

router.get("/logout", ensureAuthentication, (req, res, next) => {
    // .logout() is added by passport library on request body
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    res.redirect('/')
})

module.exports = router

function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated!");
        next()
    } else {
        res.redirect('/auth/login')
    }
}

