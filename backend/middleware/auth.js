const jwt = require('jsonwebtoken');

// 1) Just verify token & set req.user
function verifyToken(req, res, next) {
  const header = req.header('Authorization');
  const token  = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// 2) Only Admins
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') return next();
    res.status(403).json({ msg: 'Admin access required' });
  });
}

// 3) Only Artisans
function verifyArtisan(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'artisan') return next();
    res.status(403).json({ msg: 'Artisan access required' });
  });
}

// 4) Only Buyers
function verifyBuyer(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'buyer') return next();
    res.status(403).json({ msg: 'Buyer access required' });
  });
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyArtisan,
  verifyBuyer
};
