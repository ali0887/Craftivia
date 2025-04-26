const express = require('express');
const { getArtisans, updateProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Public route to get all artisans
router.get('/artisans', getArtisans);

// Protected route - update user profile
router.put('/profile', verifyToken, updateProfile);

module.exports = router; 