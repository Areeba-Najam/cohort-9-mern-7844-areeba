const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset your password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#7c5cff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    logger.info(`Password reset email sent to ${toEmail}`);
  } catch (err) {
    logger.error({ err }, 'Failed to send password reset email');
    throw err;
  }
};

module.exports = { sendPasswordResetEmail };