const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // roles: buyer, artisan, or admin
  role:     { type: String, enum: ['buyer','artisan','admin'], default: 'buyer' },
  // Profile image (optional, but recommended for artisans)
  profileImage: { type: String, default: '' },
  // Bio/description (optional, mainly for artisans)
  bio: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
