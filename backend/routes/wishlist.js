const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes require authentication
router.use(verifyToken);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router; 