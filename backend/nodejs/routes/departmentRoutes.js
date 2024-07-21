const express = require('express');
const router = express.Router();

import { getDepartmentById, getDepartments, createDepartment, updateDepartment, deleteDepartment} from '../controllers/departmentController';
import { protect, admin } from '../middleware/auth';

router.route('/').get(protect, getDepartments).post(protect, admin, createDepartment);
router.route('/:id').get(protect, getDepartmentById).put(protect, admin, updateDepartment).delete(protect, admin, deleteDepartment);

module.exports = router;
