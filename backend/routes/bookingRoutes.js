const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Book service (Customers only)
router.post('/', protect, authorize('customer'), createBooking);

// View bookings for customers
router.get('/customer', protect, authorize('customer'), getCustomerBookings);

// View bookings for providers
router.get('/provider', protect, authorize('provider'), getProviderBookings);

// Modify booking state (Both customers and providers can update booking status)
router.put('/:id/status', protect, authorize('customer', 'provider'), updateBookingStatus);

module.exports = router;
