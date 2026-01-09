const mongoose = require('mongoose');
const HabitLog = require('./models/HabitLog');
const Habit = require('./models/Habit');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        process.exit(1);
    }
};

const inspectLogs = async () => {
    await connectDB();

    try {
        const { startOfMonth, endOfMonth, format } = require('date-fns');
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const startDate = format(start, 'yyyy-MM-dd');
        const endDate = format(end, 'yyyy-MM-dd');

        const fs = require('fs');
        let output = `Range: ${startDate} to ${endDate}\n\n`;
        output += '--- HABIT STATS (DB Query) ---\n';

        const habits = await Habit.find({});

        for (const habit of habits) {
            const count = await HabitLog.countDocuments({
                habitId: habit._id,
                date: { $gte: startDate, $lte: endDate },
                $or: [
                    { score: { $gt: 0 } },
                    { status: true }
                ]
            });
            output += `[${habit.name}] ID: ${habit._id} -> Count: ${count}\n`;

            // Print dates for mismatch investigation (e.g. Wake up)
            if (habit.name.includes("Wake up")) {
                const logs = await HabitLog.find({
                    habitId: habit._id
                });
                output += `   ALL Logs: ${logs.map(l => `[${l.date}] S:${l.score} St:${l.status}`).join(', ')}\n`;
            }
            if (habit.name.includes("Family")) {
                const logs = await HabitLog.find({
                    habitId: habit._id
                });
                output += `   ALL Logs: ${logs.map(l => `[${l.date}] S:${l.score} St:${l.status}`).join(', ')}\n`;
            }
        }

        fs.writeFileSync('debug_output.txt', output);
        console.log('Output written to debug_output.txt');

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

inspectLogs();
