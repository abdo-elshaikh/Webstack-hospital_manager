const express = require('express');
const router = express.Router();
const { updateUser, getCurrentUser } = require('../controllers/userController');
const { protect, register, login, logout, forgotPassword, resetPassword } = require('../middleware/auth');

router.route('/').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword').put(resetPassword);
router.route('/profile').get(protect, getCurrentUser).put(protect, updateUser);

module.exports = router;
