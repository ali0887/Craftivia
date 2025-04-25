const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication but not restricted to buyers
router.use(verifyToken);

router.get('/',           getCart);
router.post('/',          addToCart);
router.put('/:itemId',    updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/',        clearCart);

module.exports = router;
