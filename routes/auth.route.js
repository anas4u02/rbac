const router = require('express').Router()
const User = require('../models/user.model')
const passport = require('passport');
const { invitationStatus } = require('../utils/constants');

const Invitation = require('../models/invitation.model');

let email;
let role;

router.get('/login', async (req, res, next) => {
    res.render('login');
});

router.get('/register', async (req, res, next) => {
    res.render('register');
});

router.get('/send-invite', async (req, res, next) => {
    res.render('send-invite');
});

router.post('/send-invite', async (req, res, next) => {
    try {
        email = req.body.email;
        role = req.body.role;
        const doesExit = await User.findOne({ email })
        if (doesExit) {
            res.redirect('/auth/login')
            return
        }
        const invitation = new Invitation(req.body);
        await invitation.save()
        res.redirect('/auth/accept-invite');
    }
    catch (e) {
        res.redirect('/send-invite');
    }
});

router.get('/accept-invite', async (req, res, next) => {
    res.render('accept-invite', { email, role });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.post('/register', async (req, res, next) => {
    try {
        const email = req.body.email
        const doesExit = await User.findOne({ email });
        const isInvited = await Invitation.findOne({ email });

        if (doesExit) {
            res.redirect('/auth/register')
            return
        }

        if (isInvited) {
            isInvited.invitationStatus = invitationStatus.accepted;
            isInvited.save();
        }

        const user = new User(req.body);
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

