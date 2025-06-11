// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public: register & login
router.post('/register', register);
router.post('/login', login);

// Private: get current user
router.get('/me', protect, getMe);

module.exports = router;
