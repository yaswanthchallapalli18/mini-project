const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Create a new review (Protected - Customer only)
exports.createReview = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating, comment, and booking ID are required' });
    }

    // Verify booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Validate ownership
    if (booking.customer.toString() !== customerId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to review this booking' });
    }

    // Validate completion status
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review bookings that are marked as completed',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking',
      });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: customerId,
      provider: booking.provider,
      rating: Number(rating),
      comment,
    });

    // Create notification for Provider
    await Notification.create({
      recipient: booking.provider,
      recipientModel: 'Provider',
      title: 'New Service Rating Received',
      message: `A customer has rated your service ${rating}/5. Description: "${comment.substring(0, 30)}..."`,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a specific provider
exports.getProviderReviews = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const reviews = await Review.find({ provider: providerId })
      .populate('customer', 'name profilePhoto')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
