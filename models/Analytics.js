const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  visits: { 
    type: Number, 
    default: 0 
  },
  orders: { 
    type: Number, 
    default: 0 
  },
  revenue: { 
    type: Number, 
    default: 0 
  }
});

// Create a compound index on date field to ensure uniqueness per day
AnalyticsSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema); 