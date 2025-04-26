const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Analytics = require('../models/Analytics');

// GET /api/orders - Get all orders for a user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price');
    
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/orders/admin/all - Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
      .populate('user', 'name email');
    
    res.json(orders);
  } catch (err) {
    console.error('Error getting all orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET /api/orders/:id - Get a specific order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    
    // Make sure the order belongs to the current user or the user is an admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to access this order' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error getting order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// POST /api/orders - Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { shipping, payment } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }
    
    // Calculate totals and create order items
    const orderItems = [];
    let itemsTotal = 0;
    
    for (const item of cart.items) {
      // Make sure product is available in sufficient quantity
      const product = item.product;
      
      if (!product) {
        return res.status(400).json({ msg: 'Product not found' });
      }
      
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${product.name}. Available: ${product.countInStock}`,
          product: product._id
        });
      }
      
      // Add to order items
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      itemsTotal += product.price * item.quantity;
      
      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { countInStock: -item.quantity }
      });
    }
    
    // Calculate shipping cost and total
    const shippingCost = 0; // Free shipping for demo
    const totalAmount = itemsTotal + shippingCost;
    
    // Create the order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shipping,
      payment,
      itemsTotal,
      shippingCost,
      totalAmount,
      isPaid: payment.method === 'credit_card' // Mark as paid immediately for credit card
    });
    
    if (payment.method === 'credit_card') {
      order.paidAt = Date.now();
    }
    
    await order.save();
    
    // Update analytics for this order
    try {
      // Get today's date with time set to midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Update analytics with order count and revenue
      await Analytics.findOneAndUpdate(
        { date: today },
        { 
          $inc: { 
            orders: 1,
            revenue: totalAmount 
          } 
        },
        { upsert: true, new: true }
      );
    } catch (analyticsError) {
      // Log the error but don't fail the order creation
      console.error('Error updating analytics:', analyticsError);
    }
    
    // Clear the cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );
    
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Server error' });
  }
}; 