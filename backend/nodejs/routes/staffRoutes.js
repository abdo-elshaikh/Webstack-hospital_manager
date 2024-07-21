const {
    getAllStaff,
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff, getStaffByPosition, getStaffByDepartment } = require('../controllers/staffController');
const { protect, admin } = require('../middleware/auth');
const router = require('express').Router();

router.route('/')
    .get(protect, getAllStaff)
    .post(protect, admin, createStaff);
router.route('/:id')
    .get(protect, getStaff)
    .put(protect, admin, updateStaff)
    .delete(protect, admin, deleteStaff);
router.route('/position/:id')
    .get(protect, getStaffByPosition);
router.route('/department/:id')
    .get(protect, getStaffByDepartment);
module.exports = router;
