const express = require('express');
const router = express.Router();
const {
  getProviders,
  getProviderById,
  updateProviderProfile,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public searches
router.get('/', getProviders);
router.get('/:id', getProviderById);

// Provider only updates profile photo & profile info
router.put('/profile', protect, authorize('provider'), upload.single('profilePhoto'), updateProviderProfile);

module.exports = router;
