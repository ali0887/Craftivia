const express = require('express');
const auth = require('../middleware/auth');
const {
  getAll,
  getOne,
  create,
  update,
  remove
} = require('../controllers/productController');
const router = express.Router();

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Protected routes (artisan/admin)
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;