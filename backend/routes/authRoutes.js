const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  registerProvider,
  loginCustomer,
  loginProvider,
  loginAdmin,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const upload = require('../middleware/upload');

// Customer registration with profile photo upload
router.post('/register/customer', upload.single('profilePhoto'), registerCustomer);

// Provider registration with profile photo and government ID upload
router.post(
  '/register/provider',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
  ]),
  registerProvider
);

// Unified login endpoints
router.post('/login/customer', loginCustomer);
router.post('/login/provider', loginProvider);
router.post('/login/admin', loginAdmin);

// Forgot/Reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
