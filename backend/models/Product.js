const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  countInStock: { type: Number, default: 0 },
  images: [String],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);