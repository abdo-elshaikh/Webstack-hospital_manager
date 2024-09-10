const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/User');


const getUserById = async (req, res) => {
    const { id } = req.params;
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

const getCurrentUser = async (req, res) => {
    const { id } = req.params;
    const currentUser = await User.findById(id).select('-password');
    res.status(200).json({ user: currentUser });
}

const updateUser = async (req, res) => {
    const formData = req.body;
    const { id } = req.params;
    try {
        const currentUser = await User.findById(id);
        if (currentUser) {
            currentUser.name = formData.name;
            currentUser.email = formData.email;
            currentUser.role = formData.role;
            currentUser.age = formData.age;
            currentUser.phone = formData.phone;
            currentUser.address = formData.address;
            currentUser.description = formData.description;
            if (req.file) {
                // Remove old image if it exists
                // if (currentUser.image) {
                //     fs.unlinkSync(`./uploads/${currentUser.image}`);
                // }
                // console.log(filePath);
                currentUser.image = req.file.filename;
            }
            const updatedUser = await currentUser.save();
            res.status(200).json({ user: updatedUser, message: 'User updated successfully' });
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
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (user) {
            res.status(200).json({ message: 'User deleted successfully' });
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
