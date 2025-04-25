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

// PUT /api/users/profile - Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check what fields are being updated
    const { name, bio, profileImage } = req.body;
    
    // Update fields if provided
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    
    // Only update profileImage if user is an artisan
    if (profileImage && user.role === 'artisan') {
      user.profileImage = profileImage;
    }
    
    // Save updated user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
}; 