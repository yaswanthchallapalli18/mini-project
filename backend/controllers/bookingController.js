const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Notification = require('../models/Notification');

// Create a new Booking (Protected - Customer only)
exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { providerId, bookingDate, bookingTime, address, phone, notes } = req.body;

    if (!providerId || !bookingDate || !bookingTime || !address || !phone) {
      return res.status(400).json({ success: false, message: 'All booking details are required' });
    }

    // Validate provider existence & verification status
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Service Provider not found' });
    }

    if (provider.isVerified !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This provider is not active or verified yet',
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: customerId,
      provider: providerId,
      serviceName: provider.category,
      bookingDate: new Date(bookingDate),
      bookingTime,
      address,
      phone,
      charges: provider.chargesPerVisit,
      notes: notes || '',
    });

    // Create notification for Provider
    await Notification.create({
      recipient: providerId,
      recipientModel: 'Provider',
      title: 'New Service Booking Request',
      message: `You have received a new request for ${provider.category} on ${bookingDate} at ${bookingTime}.`,
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer Bookings (Protected - Customer only)
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('provider', 'name category profilePhoto chargesPerVisit phone email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Provider Bookings (Protected - Provider only)
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id })
      .populate('customer', 'name profilePhoto phone email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Booking Status (Protected - Customer / Provider)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status code' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'name')
      .populate('provider', 'name category');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    // Role validation
    // Customer can only cancel
    if (req.user.role === 'customer') {
      if (booking.customer._id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ success: false, message: 'Customers can only cancel bookings' });
      }
    }

    // Provider can accept, reject, complete
    if (req.user.role === 'provider') {
      if (booking.provider._id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      }
      if (status === 'cancelled') {
        return res.status(400).json({ success: false, message: 'Providers cannot cancel bookings' });
      }
    }

    // Update status
    booking.status = status;
    await booking.save();

    // Side effects
    if (status === 'completed') {
      // Increment completed jobs count for Provider
      await Provider.findByIdAndUpdate(booking.provider._id, {
        $inc: { completedJobsCount: 1 },
      });
    }

    // Generate notification for customer or provider
    const userRole = req.user.role;
    const recipientId = userRole === 'customer' ? booking.provider._id : booking.customer._id;
    const recipientModel = userRole === 'customer' ? 'Provider' : 'User';
    const titleMap = {
      accepted: 'Booking Request Approved',
      rejected: 'Booking Request Declined',
      completed: 'Job Marked Completed',
      cancelled: 'Booking Request Cancelled',
    };
    const messageMap = {
      accepted: `${booking.provider.name} accepted your request for ${booking.serviceName}.`,
      rejected: `${booking.provider.name} declined your request for ${booking.serviceName}.`,
      completed: `${booking.provider.name} has completed the service. Please leave a rating and review!`,
      cancelled: `${booking.customer.name} cancelled the booking request for ${booking.serviceName}.`,
    };

    await Notification.create({
      recipient: recipientId,
      recipientModel: recipientModel,
      title: titleMap[status],
      message: messageMap[status],
    });

    res.status(200).json({
      success: true,
      message: `Booking status successfully changed to ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
