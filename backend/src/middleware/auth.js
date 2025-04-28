const jwt = require('jsonwebtoken');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      throw new AuthenticationError('No token provided');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id },select:{id:true,email:true,role:true} });
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('Not authorized to access this route'));
    }
    next();
  };
};

// const isOwnerOrAdmin = async (req, res, next) => {
//   try {
//     const resourceUserId = req.params.userId || req.body.userId;
//     if (req.user.role === 'admin' || req.user.id === resourceUserId) {
//       return next();
//     }
//     throw new AuthorizationError('Not authorized to perform this action');
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  verifyToken,
  authorize,
//   isOwnerOrAdmin
};