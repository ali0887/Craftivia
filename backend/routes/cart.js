const express = require('express');
const { verifyBuyer } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require a logged-in buyer
router.use(verifyBuyer);

router.get('/',           getCart);
router.post('/',          addToCart);
router.put('/:itemId',    updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/',        clearCart);

module.exports = router;
