const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const { getPositions, getPositionById, createPosition, updatePosition, deletePosition } = require('../controllers/positionController');

router.route('/').get(protect, getPositions).post(protect, admin, createPosition);
router.route('/:id').get(protect, getPositionById).put(protect, admin, updatePosition).delete(protect, admin, deletePosition);

module.exports = router;
