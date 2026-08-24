const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const registerUser = async ({ name, email, password }) => {
  try {
    const existingUser = await User.findOne({ email: String(email) });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return { user, token };
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('An account with this email already exists', 409);
    }
    if (err.name === 'ValidationError') {
      throw new AppError(err.message, 400);
    }
    throw err;
  }
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: String(email) }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);
  return { user, token };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  changePassword,
};