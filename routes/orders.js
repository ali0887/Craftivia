const express = require('express');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  createOrder,
  getAllOrders
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

// Admin routes
router.get('/admin/all', verifyAdmin, getAllOrders);

module.exports = router; 