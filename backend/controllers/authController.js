const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hash, role });
    await user.save();

    res.json({ msg: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// POST /api/auth/login  (general users: buyer & artisan)
exports.loginGeneral = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.role === 'admin') {
      return res.status(403).json({ msg: 'Use /admin/login for admin accounts' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// POST /api/auth/admin/login  (admins only)
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin accounts only' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
