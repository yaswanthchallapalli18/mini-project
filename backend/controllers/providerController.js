const Provider = require('../models/Provider');
const Review = require('../models/Review');

// Helper to determine Cloudinary vs Local path URL
const getFileUrl = (file) => {
  if (!file) return '';
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  return `/uploads/${file.filename}`;
};


// Get all verified providers with query filters
exports.getProviders = async (req, res) => {
  try {
    const { category, location, minRating, maxPrice, isAvailable } = req.query;

    // Start with verified approved providers
    let query = { isVerified: 'approved' };

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply location search (case-insensitive regex)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Apply availability filter
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Apply price filter (charges less than or equal to maxPrice)
    if (maxPrice) {
      query.chargesPerVisit = { $lte: Number(maxPrice) };
    }

    // Apply rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    const providers = await Provider.find(query).select('-password');
    res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select('-password');
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // Retrieve provider reviews
    const reviews = await Review.find({ provider: req.params.id })
      .populate('customer', 'name profilePhoto')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        provider,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update provider profile configuration (Protected - Provider only)
exports.updateProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { isAvailable, workingHours, chargesPerVisit, description, phone, location } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    // Update allowable fields
    if (isAvailable !== undefined) provider.isAvailable = isAvailable;
    if (workingHours) provider.workingHours = workingHours;
    if (chargesPerVisit) provider.chargesPerVisit = Number(chargesPerVisit);
    if (description) provider.description = description;
    if (phone) provider.phone = phone;
    if (location) provider.location = location;

    // Handle profile photo update if file exists
    if (req.file) {
      provider.profilePhoto = getFileUrl(req.file);
    }

    await provider.save();

    // Remove password from response
    const updatedData = provider.toObject();
    delete updatedData.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
