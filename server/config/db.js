const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI environment variable is missing");
        throw new Error("MONGO_URI is missing");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering for serverless
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    } catch (e) {
        cached.promise = null;
        console.error(`Error: ${e.message}`);
        // Do NOT process.exit(1) in serverless
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
