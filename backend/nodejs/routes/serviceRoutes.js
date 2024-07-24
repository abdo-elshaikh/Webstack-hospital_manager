const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
    createService,
    getServices,
    getService,
    updateService,
    deleteService,
    getServiceByDepartment
} = require('../controllers/serviceController');

router.route('/').get(getServices).post(protect, admin, createService);
router.route('/:id').get(getService).put(protect, admin, updateService).delete(protect, admin, deleteService);
router.route('/department/:id').get(getServiceByDepartment);

module.exports = router;
