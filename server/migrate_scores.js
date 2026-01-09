const mongoose = require('mongoose');
const HabitLog = require('./models/HabitLog');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const migrateData = async () => {
    await connectDB();

    try {
        console.log('Starting migration...');

        // 1. Update logs that have NO score field to default 100
        const result = await HabitLog.updateMany(
            { score: { $exists: false } },
            { $set: { score: 100 } }
        );

        console.log(`Migrated ${result.modifiedCount} logs (Added score: 100).`);

        // 2. Optional: If score exists but is 0 and status is true (unlikely case, but check)
        // const result2 = await HabitLog.updateMany(
        //     { score: 0, status: true },
        //     { $set: { score: 100 } }
        // );
        // console.log(`Fixed ${result2.modifiedCount} mixed-state logs.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

migrateData();
