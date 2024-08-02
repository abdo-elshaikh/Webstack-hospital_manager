const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getPatientById,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByCode,
  getPatientsByName,
  getMaxPatientCode,
} = require('../controllers/patientController');

router.get('/', protect, getPatients);
router.post('/', protect, createPatient);

router.post('/name', protect, getPatientsByName);
router.post('/code', protect, getPatientByCode);
router.get('/max-code', protect, getMaxPatientCode);

router.get('/patient/:id', protect, getPatientById);
router.put('/patient/:id', protect, updatePatient);
router.delete('/patient/:id', protect, admin, deletePatient);

module.exports = router;

