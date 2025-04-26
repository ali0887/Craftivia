const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');
const userRoutes    = require('./routes/users');
const orderRoutes   = require('./routes/orders');
const adminRoutes   = require('./routes/admin');
const wishlistRoutes = require('./routes/wishlist');
const { trackVisit } = require('./middleware/analytics');

const app = express();

// --- Middleware ---
app.use(cors());
// Increase JSON payload limit to 50MB to accommodate large base64-encoded images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(trackVisit);

// --- Routes ---
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// --- Start Server ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('Mongo connection error:', err));
