const express = require('express');
const router = express.Router();
const { updateAttendance, bulkUpdateAttendance, getAttendanceByClass } = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/update', authenticate, authorize('lecturer', 'admin'), updateAttendance);
router.post('/bulk-update', authenticate, authorize('lecturer', 'admin'), bulkUpdateAttendance);
router.get('/class', authenticate, authorize('lecturer', 'admin'), getAttendanceByClass);

module.exports = router;
