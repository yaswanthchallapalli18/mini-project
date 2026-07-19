const express = require('express');
const router = express.Router();
const {
  getCustomerProfile,
  updateCustomerProfile,
  toggleFavorite,
  getFavorites,
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Enforce protection on all routes
router.use(protect);
router.use(authorize('customer'));

// Customer details & configurations
router.get('/profile', getCustomerProfile);
router.put('/profile', upload.single('profilePhoto'), updateCustomerProfile);

// Favorites endpoints
router.post('/favorites/:providerId', toggleFavorite);
router.get('/favorites', getFavorites);

module.exports = router;
