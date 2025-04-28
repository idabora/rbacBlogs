const express = require('express');
const authRoutes = require('./auth');
const blogRoutes = require('./blog');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);

module.exports = router;