const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBlog = async (req, res, next) => {
  try {
    let { title, content } = req.body;
    // Validate required fields
    if (!title || !content ) {
      throw new ValidationError('Title, content, and status are required');
    }
    // Trim values
    title = title.trim();
    content = content.trim();
    if (!title || !content ) {
      throw new ValidationError('Title and content cannot be empty');
    }
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: req.user.id,
        published:true
      }
    });
    res.status(201).json({
      status: 'success',
      data: { blog }
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const where = {};

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      data: { blogs }
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    res.status(200).json({
      status: 'success',
      data: { blog }
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {

    if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('content')) {
      throw new ValidationError('Title or content are required');
    }

    const blog = await prisma.blog.findUnique({ where: { id: Number(req.params.id) } });
    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    let { title, content } = req.body;
    // Trim values
    title = title.trim();
    content = content.trim();

    const updatedBlog = await prisma.blog.update({
      where: { id: Number(req.params.id) },
      data: { title, content }
    });
    res.status(200).json({
      status: 'success',
      data: { blog: updatedBlog }
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: Number(req.params.id) } });
    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    if (blog.userId !== req.user.id && req.user.role !== 'Admin') {
      throw new AuthorizationError('Not authorized to delete this blog post');
    }

    await prisma.blog.delete({ where: { id: Number(req.params.id) } });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};