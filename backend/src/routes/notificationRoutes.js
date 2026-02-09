const express = require('express');
const router = express.Router();
const { sendStudentParentReports, sendLecturerReminders } = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/send-reports', authenticate, authorize('admin', 'lecturer'), sendStudentParentReports);
router.post('/send-reminders', authenticate, authorize('admin'), sendLecturerReminders);

module.exports = router;
