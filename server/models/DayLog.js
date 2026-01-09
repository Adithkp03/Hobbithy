const mongoose = require('mongoose');

const dayLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    isBadDay: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Compound index to ensure one log per day per user
dayLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DayLog', dayLogSchema);
