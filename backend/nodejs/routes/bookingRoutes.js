const { bookAppointment, getAllBooking, getBookingByUser, getBookingBetweenDate } = require('../controllers/bookAppointmentController');
const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').post(protect, bookAppointment).get(protect, getAllBooking);
router.route('/user').get(protect, getBookingByUser);
router.route('/date').post(protect, getBookingBetweenDate);

module.exports = router;
