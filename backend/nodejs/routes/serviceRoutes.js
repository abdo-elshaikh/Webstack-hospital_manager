const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
    createService,
    getServices,
    getService,
    updateService,
    deleteService,
    getServiceByDepartment,
    getServicesByType,
    getServicePriceByType
} = require('../controllers/serviceController');

// Routes
router.route('/').get(getServices).post(protect, admin, createService);
router.route('/:id').get(getService).put(protect, admin, updateService).delete(protect, admin, deleteService);
router.route('/department/:id').get(getServiceByDepartment);
router.route('/service-type/:type').get(getServicesByType);
router.route('/service-price/:id/:type').get(getServicePriceByType);

// Error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

module.exports = router;

