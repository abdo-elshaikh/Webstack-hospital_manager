const express = require('express');
const router = express.Router();

const {
    getAppointmentById,
    getAllAppointments,
    createAppointment,
    changeStatus,
    deleteAppointment,
    updateAppointment,
    deleteAll,
    getAppointmentsByPatient
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(protect, getAllAppointments)
    .post(protect, createAppointment);
router.route('/:id')
    .get(protect, getAppointmentById)
    .put(protect, updateAppointment)
    .delete(protect, admin, deleteAppointment);
router.route('/status/:id')
    .put(protect, changeStatus);
router.route('/delete/all').delete(protect, admin, deleteAll);
router.route('/patient/:patientId').get(protect, getAppointmentsByPatient);

module.exports = router;
