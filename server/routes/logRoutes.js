const express = require('express');
const router = express.Router();
const {
    toggleLog,
    getMonthlyLogs,
    getWeeklyLogs,
    getYearlyLogs,
    getDayLog,
    updateDayLog
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, toggleLog);
router.get('/day', protect, getDayLog);
router.post('/day', protect, updateDayLog);
router.get('/month', protect, getMonthlyLogs);
router.get('/week', protect, getWeeklyLogs);
router.get('/year', protect, getYearlyLogs);

module.exports = router;
