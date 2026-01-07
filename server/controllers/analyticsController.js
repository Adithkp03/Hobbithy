const Log = require('../models/HabitLog');
const Habit = require('../models/Habit');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

// Get generic analytics (streaks, completion rates)
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const habits = await Habit.find({ userId });
        const habitIds = habits.map(h => h._id);

        // 1. Completion Rate per Habit (All time or Monthly)
        // Simple Version: Count total logs vs total days since creation?
        // Let's do Monthly Performance for the current month
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const monthlyLogs = await Log.aggregate([
            {
                $match: {
                    habitId: { $in: habitIds },
                    date: { $gte: FormatDate(start), $lte: FormatDate(end) },
                    status: true
                }
            },
            {
                $group: {
                    _id: '$habitId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Streaks (Calculation in JS for simplicity)
        // This can be heavy in aggregation, so we might fetch logs and process
        // or just return the "current streak" if we were tracking it on the Habit model
        // For now, let's just return the raw counts and maybe total logs

        const totalLogs = await Log.countDocuments({ habitId: { $in: habitIds }, status: true });

        // Map data specific to habits
        const analyticsData = habits.map(habit => {
            const mLog = monthlyLogs.find(l => l._id.toString() === habit._id.toString());
            return {
                id: habit._id,
                name: habit.name,
                monthlyCount: mLog ? mLog.count : 0,
                color: habit.color // use color if available
            };
        });

        res.json({
            stats: {
                totalHabits: habits.length,
                totalLogs: totalLogs
            },
            habitPerformance: analyticsData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper: Format date to YYYY-MM-DD match existing string format in DB
function FormatDate(date) {
    return format(date, 'yyyy-MM-dd');
}
