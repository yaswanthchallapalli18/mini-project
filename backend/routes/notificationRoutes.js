const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Get all notification history
router.get('/', protect, getNotifications);

// Mark a single alert as read
router.put('/:id/read', protect, markAsRead);

module.exports = router;
