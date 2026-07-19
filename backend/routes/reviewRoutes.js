const express = require('express');
const router = express.Router();
const { createReview, getProviderReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Create review (Customer only)
router.post('/', protect, authorize('customer'), createReview);

// Public provider reviews
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;
