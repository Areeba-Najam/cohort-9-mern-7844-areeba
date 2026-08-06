require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_here' || process.env.JWT_SECRET.length < 32) {
  logger.error('FATAL ERROR: JWT_SECRET is missing or insecure. It must be at least 32 characters.');
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    
    server.once('error', (err) => {
      logger.error({ err }, 'Server failed to start due to HTTP listen/bind error');
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled Rejection - shutting down');
      server.close(() => process.exit(1));
    });

  } catch (err) {
    logger.error({ err }, 'Database startup failed');
    process.exit(1);
  }
};

startServer();