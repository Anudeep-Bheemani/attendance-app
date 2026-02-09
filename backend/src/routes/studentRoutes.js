const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, getStudentAttendance } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin', 'lecturer'), getAllStudents);
router.get('/:id', authenticate, getStudentById);
router.get('/:id/attendance', authenticate, getStudentAttendance);

module.exports = router;
