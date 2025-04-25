const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user (buyer or artisan)
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ chars').isLength({ min: 6 })
  ],
  register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & return token
// @access  Public
router.post('/login', login);

module.exports = router;