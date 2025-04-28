const express = require('express');
const { register, login, getProfile,logout } = require('../controllers/auth');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout);

// Protected routes
router.get('/profile', verifyToken, getProfile);

module.exports = router;