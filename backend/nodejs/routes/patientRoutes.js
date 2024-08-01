const express = require('express');
const router = express.Router();

const { getPatientById, getPatients, createPatient, updatePatient, deletePatient, getPatientByCode, getPatientsByName, getMaxPatientCode } = require('../controllers/patientController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/name').get(protect, getPatientsByName);
router.route('/code').get(protect, getPatientByCode);
router.route('/max-code').get(protect, getMaxPatientCode);
router.route('/patient/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, admin, deletePatient);

module.exports = router;
