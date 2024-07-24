import { bookAppointment, getAllBooking, getBookingByUser, getBookingBetweenDate } from '../controllers/bookAppointmentController';
import express from 'express';
import { protect } from '../middleware/auth';
const router = express.Router();

router.route('/').post(protect, bookAppointment).get(protect, getAllBooking);
router.route('/user').get(protect, getBookingByUser);
router.route('/date').post(protect, getBookingBetweenDate);

module.exports = router;
