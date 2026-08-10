const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error({ err }, 'MongoDB Atlas connection failed — check credentials and IP whitelist');
    process.exit(1);
  }
};

module.exports = connectDB;