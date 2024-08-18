const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getUserById, updateUserActivation } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/users').get(protect, admin, getAllUsers);
router.route('/user/:id').get(protect, getUserById).put(protect, admin, updateUserRole).delete(protect, admin, deleteUser);
router.route('/user/activation/:id').put(updateUserActivation);

module.exports = router;