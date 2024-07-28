const express = require('express');
const passport = require('passport');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const { user, token } = req.user;
        res.redirect(`${process.env.CLIENT_URL}/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`);
    }
);

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const { user, token } = req.user;
        res.redirect(`${process.env.CLIENT_URL}/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(user))}`);
    }
);

module.exports = router;
