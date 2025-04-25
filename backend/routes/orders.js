const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder
} = require('../controllers/orderController');

const router = express.Router();

// All order routes require authentication
router.use(verifyToken);

// Get user's orders
router.get('/', getOrders);

// Get specific order
router.get('/:id', getOrderById);

// Create a new order
router.post('/', createOrder);

module.exports = router; 