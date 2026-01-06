const express = require('express');
const router = express.Router();
const {
    getHabits,
    createHabit,
    deleteHabit,
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHabits).post(protect, createHabit);
router.route('/:id').delete(protect, deleteHabit);

module.exports = router;
