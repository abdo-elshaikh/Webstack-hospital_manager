const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_URI + '/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            console.log('Google user: ' + user);
            if (!user) {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    image: profile.photos[0].value,
                    isActive: true
                };
                user = await User.create(newUser);
            }
            const token = generateToken(user._id);

            return done(null, { user, token });
        } catch (error) {
            return done(error, false);
        }

    }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.SERVER_URI + '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ facebookId: profile.id });
            console.log('Facebook user: ' + user);
            if (!user) {
                const newUser = {
                    facebookId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    image: profile.photos[0].value,
                    isActive: true
                };
                user = await User.create(newUser);
            }
            const token = generateToken(user._id);
            return done(null, { user, token });
        } catch (error) {
            return done(error, false);
        }
    }
));
