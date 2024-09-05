const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/mailService');
const dotenv = require('dotenv');
dotenv.config();

const initAdmin = async () => {
    try {
        const user = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!user) {
            const newUser = new User({
                email: process.env.ADMIN_EMAIL,
                name: process.env.ADMIN_NAME,
                password: process.env.ADMIN_PASSWORD,
                role: process.env.ADMIN_ROLE,
                isActive: true
            });
            await newUser.save();
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error(error);
    }
}

const register = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists Try logging in' });
        }

        const newUser = await User.create({ email, name, password, isActive: false });

        if (!newUser) {
            return res.status(400).json({ error: 'User could not be created Try again' });
        }

        const activationToken = generateToken(newUser._id);
        const activationUrl = `${process.env.CLIENT_URL}/auth/activate/${activationToken}`;
        const activationMessage = `Hello ${newUser.name},\nWelcome to our platform.\nPlease confirm your email by clicking on the following link to activate your account:\n\n${activationUrl}`;

        await sendEmail({
            email: newUser.email,
            subject: 'Activate your account',
            message: activationMessage
        });

        const { password: userPassword, ...userWithoutPassword } = newUser._doc;

        res.status(200).json({
            message: 'User created successfully - check your email for activation link', user: userWithoutPassword, token: activationToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong: Internal server error' });
    }
};

const resetActivation = async (req, res) => {
    // console.log('req.params', req.params);
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user || user.isActive) {
            return res.status(404).json({ message: 'User not found or already activated' });
        }
        const newToken = generateToken(user._id);
        const activationUrl = `${process.env.CLIENT_URL}/auth/activate/${newToken}`;
        const activationMessage = `Hello ${user.name},\nPlease confirm your email by clicking on the following link to activate your account:\n\n${activationUrl}`;
        await sendEmail({
            email: user.email,
            subject: 'Activate your account',
            message: activationMessage
        });
        res.status(200).json({ token: newToken, message: 'Activation link sent to your email address - please check your email: ' + user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong: Internal server error' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.googleId || user.facebookId) {
            const loginMethod = user.googleId ? 'Google' : 'Facebook';
            return res.status(401).json({ message: `You have registered with ${loginMethod}. Please login with ${loginMethod}.` });
        }

        if (await user.matchPassword(password)) {
            if (!user.isActive) {
                return res.status(401).json({ message: 'User is not active. Please contact the admin to activate your account.' });
            }

            const token = generateToken(user._id);
            const { password, ...userWithoutPassword } = user._doc;
            return res.status(200).json({ user: userWithoutPassword, token, message: `Welcome back ${user.name}!` });
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = generateToken({ id: user._id });
        const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        const info = await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        if (info) {
            res.status(200).json({ info, message: 'Password reset email sent' });
        } else {
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ message: 'Invalid reset token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        // console.log('token: ' + token);
    } else if (req.cookies.token) {
        token = req.cookies.token;
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log( 'user id: ' + decoded.id);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, invalid User ID' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === process.env.ADMIN_ROLE) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { register, login, protect, admin, forgotPassword, resetPassword, logout, initAdmin, resetActivation };
