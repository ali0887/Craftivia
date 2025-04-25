const express = require('express');
const { verifyArtisan, verifyToken } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeProduct
} = require('../controllers/productController');

const router = express.Router();

// Public
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Artisan-only creation
router.post('/',   verifyArtisan, createProduct);

// Authenticated updates/deletes (controller enforces owner or admin)
router.put('/:id',    verifyToken, updateProduct);
router.delete('/:id', verifyToken, removeProduct);

module.exports = router;
