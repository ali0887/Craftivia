const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  const products = await Product.find().populate('artisan','name');
  res.json(products);
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('artisan','name');
  if (!product) return res.status(404).json({ msg: 'Not found' });
  res.json(product);
};

// POST /api/products  (only artisan)
exports.createProduct = async (req, res) => {
  const data = { ...req.body, artisan: req.user.id };
  const product = new Product(data);
  await product.save();
  res.json(product);
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: 'Not found' });

  // only owner or admin can update
  if (product.artisan.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE /api/products/:id
exports.removeProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ msg: 'Not found' });

  if (product.artisan.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Unauthorized' });
  }

  await product.deleteOne();
  res.json({ msg: 'Deleted' });
};
