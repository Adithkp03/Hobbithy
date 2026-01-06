const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @desc    Get habits
// @route   GET /habits
// @access  Private
const getHabits = async (req, res) => {
    const habits = await Habit.find({ userId: req.user.id });
    res.status(200).json(habits);
};

// @desc    Create habit
// @route   POST /habits
// @access  Private
const createHabit = async (req, res) => {
    if (!req.body.name || !req.body.color) {
        return res.status(400).json({ message: 'Please add a name and color' });
    }

    const habit = await Habit.create({
        userId: req.user.id,
        name: req.body.name,
        color: req.body.color,
        targetDays: req.body.targetDays,
    });

    res.status(200).json(habit);
};

// @desc    Delete habit
// @route   DELETE /habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the habit user
    if (habit.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete habit and associated logs
    await Habit.deleteOne({ _id: req.params.id });
    // Ideally, also delete associated logs
    await HabitLog.deleteMany({ habitId: req.params.id });

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getHabits,
    createHabit,
    deleteHabit,
};
