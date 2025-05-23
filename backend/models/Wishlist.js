const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { timestamps: true });

// A user can only have a product in their wishlist once
WishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema); 