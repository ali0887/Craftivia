const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newProd = new Product({ artisan: req.user.id, ...req.body });
    const saved = await newProd.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};