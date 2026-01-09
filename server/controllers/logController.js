const HabitLog = require('../models/HabitLog');
const DayLog = require('../models/DayLog');
const Habit = require('../models/Habit');

// @desc    Toggle habit completion log (score based)
// @route   POST /logs
// @access  Private
const toggleLog = async (req, res) => {
    const { habitId, date, score } = req.body;

    if (!habitId || !date) {
        return res.status(400).json({ message: 'Please add habitId and date' });
    }

    // Verify habit belongs to user
    const habit = await Habit.findById(habitId);
    if (!habit || habit.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    // Check if log exists
    let log = await HabitLog.findOne({
        userId: req.user.id,
        habitId,
        date
    });

    if (log) {
        // Update score if provided
        if (score !== undefined) {
            log.score = score;
            await log.save();
        } else {
            // Cycle logic if no score provided (Legacy/Simple toggle support)
            // If it exists (assumed 100 or >0), remove it
            await log.deleteOne();
            return res.json({ message: 'Log removed', habitId, date });
        }
    } else {
        // Create new log
        // Default score to 100 if not provided
        log = await HabitLog.create({
            userId: req.user.id,
            habitId,
            date,
            score: score !== undefined ? score : 100
        });
    }

    res.status(200).json(log);
};

// @desc    Get day log (Bad Day status)
// @route   GET /logs/day
// @access  Private
const getDayLog = async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date required' });

    const log = await DayLog.findOne({ userId: req.user.id, date });
    res.json(log || { isBadDay: false });
};

// @desc    Update day log (Bad Day status)
// @route   POST /logs/day
// @access  Private
const updateDayLog = async (req, res) => {
    const { date, isBadDay, note } = req.body;

    if (!date) return res.status(400).json({ message: 'Date required' });

    let log = await DayLog.findOne({ userId: req.user.id, date });

    if (log) {
        if (isBadDay !== undefined) log.isBadDay = isBadDay;
        if (note !== undefined) log.note = note;
        await log.save();
    } else {
        log = await DayLog.create({
            userId: req.user.id,
            date,
            isBadDay: isBadDay || false,
            note: note || ''
        });
    }

    res.json(log);
};

// @desc    Get logs for a specific period
// @access  Private
// Helper function
const getLogsByDateRange = async (userId, startDate, endDate) => {
    return await HabitLog.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
    });
};

// @desc    Get monthly logs
// @route   GET /logs/month
// @access  Private
// Query: ?year=2023&month=01
const getMonthlyLogs = async (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ message: 'Year and month required' });

    // Regex match for YYYY-MM
    const logs = await HabitLog.find({
        userId: req.user.id,
        date: { $regex: `^${year}-${month.toString().padStart(2, '0')}` }
    });

    res.status(200).json(logs);
};

// @desc    Get weekly logs
// @route   GET /logs/week
// @access  Private
// Query: ?startDate=YYYY-MM-DD
const getWeeklyLogs = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate) return res.status(400).json({ message: 'Start date required' });

    if (startDate && endDate) {
        const logs = await HabitLog.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate }
        });
        return res.status(200).json(logs);
    }

    res.status(400).json({ message: 'Start and end date required' });
};

// @desc    Get yearly logs (heatmap)
// @route   GET /logs/year
// @access  Private
// Query: ?year=2024
const getYearlyLogs = async (req, res) => {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'Year required' });

    const logs = await HabitLog.find({
        userId: req.user.id,
        date: { $regex: `^${year}-` }
    });

    res.status(200).json(logs);
};

module.exports = {
    toggleLog,
    getDayLog,
    updateDayLog,
    getMonthlyLogs,
    getWeeklyLogs,
    getYearlyLogs
};
