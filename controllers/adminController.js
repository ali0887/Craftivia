const User = require('../models/User');
const Order = require('../models/Order');
const Analytics = require('../models/Analytics');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const period = req.params.period || 'week'; // Default to week
    let startDate, endDate = new Date();
    
    // Set start date based on period
    switch (period) {
      case 'day':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get analytics data
    const analyticsData = await Analytics.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Get order data
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate total metrics
    const totalVisits = analyticsData.reduce((total, record) => total + record.visits, 0);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);

    // Create data series for charts
    const visitSeries = analyticsData.map(record => ({
      date: record.date.toISOString().split('T')[0],
      visits: record.visits
    }));

    // Group orders by date for chart
    const ordersByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { count: 0, revenue: 0 };
      }
      acc[date].count += 1;
      acc[date].revenue += order.totalPrice;
      return acc;
    }, {});

    // Convert to arrays for chart data
    const orderSeries = Object.keys(ordersByDate).map(date => ({
      date,
      orders: ordersByDate[date].count,
      revenue: ordersByDate[date].revenue
    }));

    res.json({
      period,
      summary: {
        totalVisits,
        totalOrders,
        totalRevenue
      },
      series: {
        visits: visitSeries,
        orders: orderSeries
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAnalytics
}; 