const express = require('express');
const router = express.Router();
const { createReflection, getLatestReflection } = require('../controllers/reflectionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReflection);
router.get('/latest', protect, getLatestReflection);

module.exports = router;
