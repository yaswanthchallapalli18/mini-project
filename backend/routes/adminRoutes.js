const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingProviders,
  verifyProvider,
  getAllUsers,
  getAllProviders,
  getAllBookings,
  deleteUser,
  deleteProvider,
  getAnalyticsStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Make all routes below this middleware verify authorization
router.use(protect);
router.use(authorize('admin'));

// Stats and actions
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalyticsStats);
router.get('/providers/pending', getPendingProviders);
router.put('/providers/:id/verify', verifyProvider);

// Records tables
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/providers', getAllProviders);
router.delete('/providers/:id', deleteProvider);
router.get('/bookings', getAllBookings);

module.exports = router;
