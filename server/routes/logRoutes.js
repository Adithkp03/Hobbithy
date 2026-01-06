const express = require('express');
const router = express.Router();
const {
    toggleLog,
    getMonthlyLogs,
    getWeeklyLogs,
    getYearlyLogs
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, toggleLog);
router.get('/month', protect, getMonthlyLogs);
router.get('/week', protect, getWeeklyLogs);
router.get('/year', protect, getYearlyLogs);

module.exports = router;
