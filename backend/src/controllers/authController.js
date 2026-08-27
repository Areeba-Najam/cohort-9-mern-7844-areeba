const { AppError, asyncHandler } = require('../middleware/errorHandler');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError('Please provide all required fields: name, email, and password', 400);
  }
  const { user, token } = await authService.registerUser({ name, email, password });
  res.status(201).json({
    success: true,
    data: { user, token },
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
    data: { user, token },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide both current and new password', 400);
  }
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  res.status(200).json({ success: true, message: 'Password changed successfully.' });
});

module.exports = { register, login, getMe, changePassword };