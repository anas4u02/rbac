const router = require('express').Router()
const User = require('../models/user.model')
const passport = require('passport');
const { invitationStatus } = require('../utils/constants');

const { MailtrapClient } = require("mailtrap");
const Invitation = require('../models/invitation.model');

const TOKEN = "06fd42045a4805b24b3a6321420a8ea0";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

let email;
let role;

const sender = {
    email: "mailtrap@anas4u02.github.io",
    name: "Mailtrap Test",
};

const recipients = [
    {
        email: "mohammadanas.work@gmail.com",
    }
];

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
            res.redirect('/auth/register')
            return
        }
        const invitation = new Invitation(req.body);
        await invitation.save()
        res.redirect('/auth/accept-invite');
    }
    catch (e) {
        res.redirect('/send-invite');
    }
    // try {
    // email = req.body.email;
    // role = req.body.role;

    // client
    //     .send({
    //         from: sender,
    //         to: recipients,
    //         subject: "You are awesome!",
    //         text: "Congrats for sending test email with Mailtrap!",
    //         category: "Integration Test",
    //     })
    //     .then(console.log, console.error);

    // Insert mail trap code here to send an email
    // } catch (e) {
    //     next(e);
    // }
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
    console.log("Inside POST request");
    try {
        // console.log(req.body)
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

