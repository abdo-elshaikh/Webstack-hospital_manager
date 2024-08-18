const express = require('express');
const router = express.Router();
const { updateUser, getCurrentUser } = require('../controllers/userController');
const { protect, register, login, logout, forgotPassword, resetPassword, resetActivation } = require('../middleware/auth');
import { upload } from '../utils/upload';



router.route('/').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reactivate/:id').put(resetActivation);
router.route('/reset-password/:token').put(resetPassword);
router.route('/current-user/:id').get(protect, getCurrentUser);
router.route('/current-user/:id').put(protect, upload.single('image'), updateUser);

module.exports = router;
