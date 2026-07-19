const User = require('../models/User');
const Provider = require('../models/Provider');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper to determine Cloudinary vs Local path URL
const getFileUrl = (file) => {
  if (!file) return '';
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  return `/uploads/${file.filename}`;
};


// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'jwt_secret_fallback_key_12345',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Helper to check if email is already taken
const isEmailTaken = async (email) => {
  const user = await User.findOne({ email });
  const provider = await Provider.findOne({ email });
  return !!(user || provider);
};

// Register Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, location } = req.body;

    if (!name || !email || !phone || !password || !location) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (await isEmailTaken(email)) {
      return res.status(400).json({ success: false, message: 'Email address already in use' });
    }

    // Check if files uploaded
    const profilePhoto = getFileUrl(req.file);


    const customer = await User.create({
      name,
      email,
      phone,
      password,
      location,
      profilePhoto,
    });

    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        location: customer.location,
        profilePhoto: customer.profilePhoto,
        role: 'customer',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register Provider
exports.registerProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      category,
      experience,
      chargesPerVisit,
      workingHours,
      location,
      description,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !category ||
      !experience ||
      !chargesPerVisit ||
      !location
    ) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    if (await isEmailTaken(email)) {
      return res.status(400).json({ success: false, message: 'Email address already in use' });
    }

    // Process files
    const profilePhoto = req.files && req.files.profilePhoto && req.files.profilePhoto[0]
      ? getFileUrl(req.files.profilePhoto[0])
      : '';
    const governmentId = req.files && req.files.governmentId && req.files.governmentId[0]
      ? getFileUrl(req.files.governmentId[0])
      : '';


    const provider = await Provider.create({
      name,
      email,
      phone,
      password,
      category,
      experience: Number(experience),
      chargesPerVisit: Number(chargesPerVisit),
      workingHours: workingHours || '09:00 - 18:00',
      location,
      description: description || '',
      profilePhoto,
      governmentId,
      isVerified: 'pending', // Requires admin approval
    });

    const token = generateToken(provider._id, 'provider');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        category: provider.category,
        experience: provider.experience,
        chargesPerVisit: provider.chargesPerVisit,
        workingHours: provider.workingHours,
        location: provider.location,
        description: provider.description,
        profilePhoto: provider.profilePhoto,
        governmentId: provider.governmentId,
        isVerified: provider.isVerified,
        role: 'provider',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const customer = await User.findOne({ email });
    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(customer._id, 'customer');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        location: customer.location,
        profilePhoto: customer.profilePhoto,
        role: 'customer',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Provider
exports.loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const provider = await Provider.findOne({ email });
    if (!provider || !(await provider.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(provider._id, 'provider');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        category: provider.category,
        experience: provider.experience,
        chargesPerVisit: provider.chargesPerVisit,
        workingHours: provider.workingHours,
        location: provider.location,
        description: provider.description,
        profilePhoto: provider.profilePhoto,
        governmentId: provider.governmentId,
        isVerified: provider.isVerified,
        isAvailable: provider.isAvailable,
        role: 'provider',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password (Mock/Generates temp link & token)
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body; // 'customer' or 'provider'

    if (!email || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email and role' });
    }

    let Model = role === 'provider' ? Provider : User;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Mock send mail: Return the token directly in JSON for easy front-end usage in development
    res.status(200).json({
      success: true,
      message: 'Password reset token generated. Proceed to reset page.',
      resetToken, // Normally sent via email, we return it to make client work easily
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { role, token, password } = req.body;

    if (!role || !token || !password) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    let Model = role === 'provider' ? Provider : User;
    const user = await Model.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
