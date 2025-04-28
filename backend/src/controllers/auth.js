const jwt = require("jsonwebtoken");
const { ValidationError, AuthenticationError } = require("../utils/errors");
const { validatePassword, hashPassword } = require("../utils/password");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    let { name, email, password ,role} = req.body;

    // Validate required fields
    if (!name || !email || !password || !["Admin", "User"].includes(role)) {
      throw new ValidationError(
        "Please provide name, email , role and password"
      );
    }

    // Trim whitespace and validate email format
    name = name.trim();
    email = email.trim();
    password = password.trim();
    role = role.trim();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ValidationError("Please provide a valid email address");
    }

    if (name.length < 3) {
      throw new ValidationError("Name must be at least 3 characters long");
    }

    // Password strength validation
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      )
    ) {
      throw new ValidationError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }],
      },
    });

    if (existingUser) {
      throw new ValidationError(
        "User with this email or username already exists"
      );
    }

    // Create new user
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role
      },
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError("Please provide email and password");
    }

    // Trim whitespace
    email = email.trim();
    password = password.trim();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ValidationError("Please provide a valid email address");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await validatePassword(password, user.password))) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        status: "Logged In successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
};
