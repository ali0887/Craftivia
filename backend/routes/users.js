const express = require('express');
const { getArtisans } = require('../controllers/userController');
const router = express.Router();

// Public route to get all artisans
router.get('/artisans', getArtisans);

module.exports = router; 