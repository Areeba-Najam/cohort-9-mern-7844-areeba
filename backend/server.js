require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');

const PORT = parseInt(process.env.PORT, 10) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_here' || process.env.JWT_SECRET.length < 32) {
  logger.error('FATAL ERROR: JWT_SECRET is missing or insecure. It must be at least 32 characters.');
  process.exit(1);
}

let server;

const shutdown = () => {
  logger.info('Shutting down gracefully...');

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    logger.info('Closed remaining connections.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    server.once('error', (err) => {
      logger.error({ err }, 'Server failed to start due to HTTP listen/bind error');
      process.exit(1);
    });

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    process.on('unhandledRejection', (err) => {
      logger.error({ err }, 'Unhandled Rejection - shutting down');
      shutdown();
    });
  } catch (err) {
    logger.error({ err }, 'Database startup failed');
    process.exit(1);
  }
};

startServer();