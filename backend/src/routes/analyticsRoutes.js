const express = require('express');
const router = express.Router();
const { getAIInsight, getClassAnalytics } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/ai-insight', authenticate, authorize('lecturer', 'admin'), getAIInsight);
router.get('/class', authenticate, authorize('lecturer', 'admin'), getClassAnalytics);

module.exports = router;
