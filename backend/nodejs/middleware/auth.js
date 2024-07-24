const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/mailService');
// const { sendSMS } = require('../utils/smsService');
import dotenv from 'dotenv'
dotenv.config();

const register = async (req, res) => {
    // console.log(req.body);
    const { email, name, password, role } = req.body;
    const isActive = role === process.env.USER_ROLE?  true : false;
    try {
        const userExists = await User.findOne({email});
        // console.log(userExists);
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            const user = await User.create({ email, name, password, isActive, role });
            if (user) {
                const token = generateToken(user._id);
                const { password, ...userWithoutPassword } = user._doc;
                res.status(201).json({ user: userWithoutPassword, token, message: 'User registered successfully' });
            } else {
                res.status(400).json({ message: 'Invalid user data' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (user.isActive) {
                const token = generateToken(user._id);
                const { password, ...userWithoutPassword } = user._doc;
                res.status(200).json({ user: userWithoutPassword, token, message: 'Successfully logged in!' });
            } else {
                res.status(401).json({
                    message: 'User is not active. Please contact the admin to activate your account'
                });
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        const token = generateToken({ id: user._id });
        const resetUrl = `${process.env.CLIENT_URL}/resetPassword/${token}`;
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
        res.status(400).json({ message: 'Invalid reset token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404).json({ message: 'No user found with this id' });
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
    res.status(200).json({ message: 'Successfully logged out' });
};


const protect = async (req, res, next) => {
    // console.log(req.headers.authorization);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized to access this route' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'No user found with this id' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this route' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === process.env.ADMIN_ROLE) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { register, login, protect, admin, forgotPassword, resetPassword, logout };
