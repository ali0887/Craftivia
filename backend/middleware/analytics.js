const Analytics = require('../models/Analytics');

// Middleware to track site visits
const trackVisit = async (req, res, next) => {
  try {
    // Skip tracking for API calls and non-GET requests
    if (req.originalUrl.startsWith('/api') || req.method !== 'GET') {
      return next();
    }

    // Get today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics record
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { visits: 1 } },
      { upsert: true, new: true }
    );

    next();
  } catch (error) {
    console.error('Error tracking visit:', error);
    next(); // Continue even if tracking fails
  }
};

module.exports = { trackVisit }; 