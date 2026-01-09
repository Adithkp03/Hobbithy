require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
// Connect to Database Middleware for Serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Connection Failed:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// Routes
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const logRoutes = require('./routes/logRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');

app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);
app.use('/logs', logRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/reflections', reflectionRoutes);

app.get('/', (req, res) => {
    res.send('Hobbithy API is running');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;
