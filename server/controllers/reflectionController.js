const Reflection = require('../models/Reflection');
const { startOfWeek, subWeeks } = require('date-fns');

// @desc    Create a new weekly reflection
// @route   POST /reflections
// @access  Private
const createReflection = async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || !answers.hardestHabit || !answers.biggestBlocker || !answers.whatWorked) {
            return res.status(400).json({ message: 'All reflection questions must be answered' });
        }

        // Calculate start of current week (assuming reflection is for the past week or current? User prompt says "Weekly Reflection")
        // Usually done on Sunday/Monday for the previous week.
        // Let's store it indexed by the *current time's* week start.
        const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start

        // Check if already exists for this week
        const existing = await Reflection.findOne({
            userId: req.user.id,
            weekStartDate
        });

        if (existing) {
            return res.status(400).json({ message: 'Reflection already submitted for this week' });
        }

        const reflection = await Reflection.create({
            userId: req.user.id,
            weekStartDate,
            answers
        });

        res.status(201).json(reflection);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get latest reflection status
// @route   GET /reflections/latest
// @access  Private
const getLatestReflection = async (req, res) => {
    try {
        // Find the most recent reflection
        const latest = await Reflection.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        // Logic to determine if due:
        // If no reflection ever -> Due? Maybe wait for 1 week of usage? 
        // Simple rule: Due if last reflection was > 7 days ago OR no reflection exists.

        let isDue = false;

        if (!latest) {
            // If brand new user, maybe don't bug them immediately?
            // But for now, let's say "True" to test the UI, or check account creation date.
            // Let's default to true for Part 2 testing.
            isDue = true;
        } else {
            const now = new Date();
            const lastDate = new Date(latest.createdAt);
            const diffTime = Math.abs(now - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 7) {
                isDue = true;
            }
        }

        res.json({
            latest,
            isDue
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all reflections for user
// @route   GET /reflections
// @access  Private
const getReflections = async (req, res) => {
    try {
        const reflections = await Reflection.find({ userId: req.user.id })
            .sort({ weekStartDate: -1 });
        res.json(reflections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createReflection,
    getLatestReflection,
    getReflections
};
