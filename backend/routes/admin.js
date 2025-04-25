const express = require('express');
const { verifyAdmin } = require('../middleware/auth');
const { 
  deleteUser, 
  getAllUsers,
  getAnalytics
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(verifyAdmin);

// User management routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Analytics routes
router.get('/analytics', getAnalytics);
router.get('/analytics/:period', getAnalytics);

module.exports = router; 