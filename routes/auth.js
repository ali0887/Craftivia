const express = require('express');
const { register, loginGeneral, loginAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/register',      register);
router.post('/login',         loginGeneral);
router.post('/admin/login',   loginAdmin);

module.exports = router;
