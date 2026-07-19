const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    category: {
      type: String,
      required: [true, 'Please select your service category'],
      enum: [
        'Electrician',
        'Plumber',
        'Carpenter',
        'Cleaner',
        'Painter',
        'AC Repair',
        'Washing Machine Repair',
        'Refrigerator Repair',
        'Pest Control',
        'Gardening',
        'Home Cleaning',
        'Appliance Repair',
      ],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide your years of experience'],
    },
    chargesPerVisit: {
      type: Number,
      required: [true, 'Please specify charges per visit'],
    },
    workingHours: {
      type: String,
      required: [true, 'Please specify your working hours (e.g., 09:00 - 18:00)'],
      default: '09:00 - 18:00',
    },
    location: {
      type: String,
      required: [true, 'Please provide your location/city'],
    },
    governmentId: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
    isVerified: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    completedJobsCount: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
ProviderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
ProviderSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Provider', ProviderSchema, 'hsb_providers');
