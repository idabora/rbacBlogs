const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blog');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Blog routes
router.post('/', verifyToken,authorize('Admin'), createBlog);
router.get('/',getAllBlogs);
router.get('/:id',verifyToken, getBlogById);
router.put('/:id',verifyToken, authorize('Admin'), updateBlog);
router.delete('/:id',verifyToken, authorize('Admin'), deleteBlog);

module.exports = router;