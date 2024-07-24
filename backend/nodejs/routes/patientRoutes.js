const express = require('express');
const router = express.Router();

import { getPatientById, getPatients, createPatient, updatePatient, deletePatient, getPatientByCode, getPatientByName } from '../controllers/patientController';
import { protect, admin } from '../middleware/auth';

router.route('/').get(protect, getPatients).post(protect, createPatient);
router.route('/:id').get(protect, getPatientById).put(protect, updatePatient).delete(protect, admin, deletePatient);
router.route('/code').get(protect, getPatientByCode);
router.route('/name').get(protect, getPatientByName);
module.exports = router;
