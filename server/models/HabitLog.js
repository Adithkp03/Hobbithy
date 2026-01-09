const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Habit'
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    score: {
        type: Number,
        enum: [0, 25, 50, 100],
        default: 100,
        required: true
    },
    note: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Compound index to ensure one log per habit per date
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);
