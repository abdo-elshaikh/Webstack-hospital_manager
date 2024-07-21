const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const generateToken = require('../utils/generateToken');

dotenv.config();

const register = async (req, res) => {
    const { email, name, password, isActive, role } = req.body;
    try {
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            isActive: isActive || true,
            role: role || process.env.USER_ROLE
        });

        if (newUser) {
            const token = generateToken(newUser._id);
            return res.status(201).json({ user: newUser, token, message: 'Successfully created new user' });
        }
        return res.status(401).json({ message: 'Invalid user data!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
                return res.status(200).json({ user: userWithoutPassword, token, message: 'Successfully logged in!' });
            } else {
                return res.status(401).json({ message: 'User is not active' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found , please add correct mail or register' });
        }
        return res.json({ user: user, message: "Successfuly founded user, please reset password" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.password = newPassword;
            await user.save();
            return res.status(200).json({ message: 'Password reset successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    return res.status(200).json({ message: 'Successfully logged out' });
};


const protect = async (req, res, next) => {
    // console.log(req.headers);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === process.env.ADMIN_ROLE) {
        next();
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { register, login, protect, admin, forgotPassword, resetPassword, logout };
