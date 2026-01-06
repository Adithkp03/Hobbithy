const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');

// @desc    Toggle habit completion log
// @route   POST /logs
// @access  Private
const toggleLog = async (req, res) => {
    const { habitId, date } = req.body;

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
        // Toggle status or delete if untoggling? 
        // User requirment says "Track completion as boolean". 
        // Usually toggling means if true -> remove or false.
        // Let's assume if it exists, we toggle the boolean status. 
        // Or if the user sends a specific status?
        // Let's implement toggle logic: if exists and status is true, set to false (or delete).
        // A cleaner approach for simple boolean tracking is: existence = done.
        // But schema has `status` field.
        // Let's support explicit status if provided, else toggle.

        if (req.body.status !== undefined) {
            log.status = req.body.status;
            await log.save();
        } else {
            // If no status provided, toggle it
            log.status = !log.status;
            await log.save();
        }
    } else {
        // Create new log
        log = await HabitLog.create({
            userId: req.user.id,
            habitId,
            date,
            status: req.body.status !== undefined ? req.body.status : true
        });
    }

    res.status(200).json(log);
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

    // Construct date strings
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    // End date: tricky with days in month, but since we use string comparison and we want the whole month:
    // We can just look for dates starting with "YYYY-MM-"
    // Or use $regex. 
    // String comparison: "2023-01-01" to "2023-01-31"

    // Easy Regex approach for YYYY-MM
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
    const { startDate } = req.query;
    if (!startDate) return res.status(400).json({ message: 'Start date required' });

    // Calculate end date (start + 6 days) or just user provided range
    // For simplicity, let's assume client sends start and end or we just fetch 7 days.
    // Let's adhere to "week" semantics.
    // Actually, simple string range query works best if client provides range.
    // If stricly /logs/week, maybe client says "week of...".
    // I'll assume client sends `startDate` and `endDate` to be safe, or I calculate.
    // Let's start with just generic range support or specific week logic if needed.
    // Requirement: "Daily habit check-ins" and "Weekly bar charts".
    // I'll just use a generic range query support via helper or specific logic.

    // Implementation: accept startDate and endDate
    // If only startDate is given, assume +7 days? No, standard is client defines range.
    // But route is /logs/week. Let's make it accept start and end date query params.

    const { endDate } = req.query;
    // If client wants a specific week, they provide the range. 
    // If backend must calculate, I'd need moment or date-fns. 
    // I'll expect client to pass range ?start=YYYY-MM-DD&end=YYYY-MM-DD

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
    getMonthlyLogs,
    getWeeklyLogs,
    getYearlyLogs
};
