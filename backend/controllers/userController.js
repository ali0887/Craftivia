const User = require('../models/User');

// GET /api/users/artisans
exports.getArtisans = async (req, res) => {
  try {
    // Find all users with role 'artisan' and only return necessary fields
    const artisans = await User.find(
      { role: 'artisan' },
      'name email profileImage bio'
    );
    
    res.json(artisans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
}; 