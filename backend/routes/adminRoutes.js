const express = require('express');
const router = express.Router();
const { getAnalytics, storeLog } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getAnalytics);
router.post('/logs', protect, storeLog);

module.exports = router;
