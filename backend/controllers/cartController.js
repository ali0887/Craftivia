const Cart = require('../models/Cart');

// GET /api/cart
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
    await cart.save();
    cart = await cart.populate('items.product');
  }
  res.json(cart);
};

// POST /api/cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const idx = cart.items.findIndex(i => i.product.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  cart = await cart.populate('items.product');
  res.json(cart);
};

// PUT /api/cart/:itemId
exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ msg: 'Cart not found' });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ msg: 'Item not found' });

  item.quantity = quantity;
  await cart.save();
  res.json(await cart.populate('items.product'));
};

// DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ msg: 'Cart not found' });

  // Find the item by id
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ msg: 'Item not found' });
  
  // Remove the item using pull method
  cart.items.pull(itemId);
  
  await cart.save();
  res.json(await cart.populate('items.product'));
};

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [] },
    { new: true }
  ).populate('items.product');
  res.json(cart);
};
