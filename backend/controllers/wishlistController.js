const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

// GET /api/wishlist - Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'product',
        select: 'name price images category countInStock',
        populate: {
          path: 'artisan',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(wishlistItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/wishlist - Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if productId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId
    });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }
    
    // Create new wishlist item
    const wishlistItem = new Wishlist({
      user: req.user.id,
      product: productId
    });
    
    await wishlistItem.save();
    
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Item already in wishlist' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/wishlist/:productId - Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if productId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    const result = await Wishlist.deleteOne({
      user: req.user.id,
      product: productId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 