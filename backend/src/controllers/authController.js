const { AppError } = require('../middleware/errorHandler');
const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError('Please provide all required fields: name, email, and password', 400);
  }
  const { user, token } = await authService.registerUser({ name, email, password });
  res.status(201).json({
    success: true,
    user,
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('Please provide both email and password', 400);
  }
  const { user, token } = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    user,
    token
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = { register, login, getMe };