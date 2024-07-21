const express = require('express');
const router = express.Router();

import { protect, admin } from '../middleware/auth';
import { getPositions, getPositionById, createPosition, updatePosition, deletePosition } from '../controllers/positionController';

router.route('/').get(protect, getPositions).post(protect, admin, createPosition);
router.route('/:id').get(protect, getPositionById).put(protect, admin, updatePosition).delete(protect, admin, deletePosition);

module.exports = router;
