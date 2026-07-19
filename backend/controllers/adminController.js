const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Get Admin Dashboard Overview Statistics (Protected - Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const totalProviders = await Provider.countDocuments();
    const pendingProviders = await Provider.countDocuments({ isVerified: 'pending' });
    const totalBookings = await Booking.countDocuments();

    // Aggregations
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0,
    };

    bookingsByStatus.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // Calculate revenue (Sum of completed bookings)
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$charges' },
        },
      },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalSales : 0;
    const platformCommission = Math.round(totalRevenue * 0.15 * 100) / 100; // 15% platform commission

    // Additional statistics for joined customers and providers
    const providersByCategory = await Provider.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const providersByVerification = await Provider.aggregate([
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 },
        },
      },
    ]);

    const customersByLocation = await User.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const providersByLocation = await Provider.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalProviders,
        pendingProviders,
        totalBookings,
        statusCounts,
        totalRevenue,
        platformCommission,
        providersByCategory,
        providersByVerification,
        customersByLocation,
        providersByLocation,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending providers (Protected - Admin only)
exports.getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ isVerified: 'pending' }).select('-password');
    res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify/Approve provider documents (Protected - Admin only)
exports.verifyProvider = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const providerId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status code' });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    provider.isVerified = status;
    await provider.save();

    // Notify provider
    const title = status === 'approved' ? 'Profile Verified!' : 'Profile Review Update';
    const message =
      status === 'approved'
        ? 'Congratulations, your documents and credentials have been approved! You are now live.'
        : 'Unfortunately, your provider registration request was declined. Please verify your submitted credentials.';

    await Notification.create({
      recipient: providerId,
      recipientModel: 'Provider',
      title,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Provider successfully marked as ${status}`,
      data: provider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users (Protected - Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all providers (Protected - Admin only)
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (Protected - Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('provider', 'name category email phone')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a customer/user (Protected - Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }
    // Delete any bookings related to this customer
    await Booking.deleteMany({ customer: req.params.id });
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'Customer account and related bookings deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a service provider (Protected - Admin only)
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }
    // Delete any bookings related to this provider
    await Booking.deleteMany({ provider: req.params.id });
    await provider.deleteOne();
    res.status(200).json({ success: true, message: 'Service provider and related bookings deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Advanced Analytics statistics (Protected - Admin only)
exports.getAnalyticsStats = async (req, res) => {
  try {
    // 1. Daily Bookings & Revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$charges', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Monthly Growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          bookingsCount: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$charges', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Peak Booking Hours
    const peakHours = await Booking.aggregate([
      {
        $project: {
          hour: { $hour: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4. Popular Services
    const popularServices = await Booking.aggregate([
      {
        $group: {
          _id: '$serviceName',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 5. Provider Performance
    const providerPerformance = await Provider.find({ isVerified: 'approved' })
      .select('name category averageRating completedJobsCount location')
      .sort({ completedJobsCount: -1, averageRating: -1 })
      .limit(5);

    // 6. Customer Retention
    const customerBookings = await Booking.aggregate([
      {
        $group: {
          _id: '$customer',
          bookingCount: { $sum: 1 },
        },
      },
    ]);
    
    let repeatCustomers = 0;
    let singleCustomers = 0;
    customerBookings.forEach((c) => {
      if (c.bookingCount > 1) repeatCustomers++;
      else singleCustomers++;
    });

    res.status(200).json({
      success: true,
      data: {
        dailyStats,
        monthlyStats,
        peakHours,
        popularServices,
        providerPerformance,
        retention: {
          repeatCustomers,
          singleCustomers,
          totalCustomers: repeatCustomers + singleCustomers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
