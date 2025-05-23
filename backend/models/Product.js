const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  String,
  category:     String,
  price:        { type: Number, required: true },
  countInStock: { type: Number, default: 0 },
  images:       [String],
  // who created it
  artisan:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
