const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a habit name'],
        trim: true
    },
    color: {
        type: String, // e.g., hex code or predefined color name
        required: [true, 'Please add a color'],
        default: '#3b82f6' // Default blue
    },
    targetDays: {
        type: Number, // e.g. 7 for everyday, or specific goal
        default: 7
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
