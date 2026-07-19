const User = require('../models/User');
const Provider = require('../models/Provider');

// Helper to determine Cloudinary vs Local path URL
const getFileUrl = (file) => {
  if (!file) return '';
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  return `/uploads/${file.filename}`;
};


// Get Customer Profile (Protected - Customer only)
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Customer Profile (Protected - Customer only)
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer profile not found' });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (location) customer.location = location;

    if (req.file) {
      customer.profilePhoto = getFileUrl(req.file);
    }

    await customer.save();

    const updatedData = customer.toObject();
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

// Toggle favorite provider (Protected - Customer only)
exports.toggleFavorite = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }

    // Verify provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Service Provider not found' });
    }

    const index = customer.favorites.indexOf(providerId);
    let message = '';
    
    if (index === -1) {
      customer.favorites.push(providerId);
      message = 'Provider added to favorites';
    } else {
      customer.favorites.splice(index, 1);
      message = 'Provider removed from favorites';
    }

    await customer.save();

    res.status(200).json({
      success: true,
      message,
      favorites: customer.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get favorite providers (Protected - Customer only)
exports.getFavorites = async (req, res) => {
  try {
    const customer = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        select: 'name category averageRating chargesPerVisit profilePhoto location experience isAvailable isVerified',
      });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }

    res.status(200).json({
      success: true,
      data: customer.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
