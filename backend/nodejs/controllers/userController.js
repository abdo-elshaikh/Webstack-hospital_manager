const bcrypt = require('bcrypt');
const User = require('../models/User');

const getUserById = async (req, res) => {
    const { id } = req.params || req.body;
    try {
        const user = await User.findById(id).select('-password');
        if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCurrentUser = (req, res) => {
    const user = req.user;
    if (user) {
        res.status(200).json({ user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findById(id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }
            const updatedUser = await user.save();
            res.status(200).json({ user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        const currentUser = await User.findById(id);
        if (currentUser) {
            currentUser.role = role;
            const updatedUser = await currentUser.save();
            res.status(200).json({ user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUserActivation = async (req, res) => {
    const { id } = req.params;
    try {
        const currentUser = await User.findById(id);
        if (currentUser) {
            currentUser.isActive = !currentUser.isActive;
            const updatedUser = await currentUser.save();
            res.status(200).json({ user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        if (users && users.length > 0) {
            res.status(200).json({ users: users });
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser, getCurrentUser, getUserById, updateUserRole, updateUserActivation };
