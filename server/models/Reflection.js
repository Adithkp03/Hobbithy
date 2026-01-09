const mongoose = require('mongoose');

const reflectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    answers: {
        hardestHabit: { type: String, required: true },
        biggestBlocker: { type: String, required: true },
        whatWorked: { type: String, required: true }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reflection', reflectionSchema);
