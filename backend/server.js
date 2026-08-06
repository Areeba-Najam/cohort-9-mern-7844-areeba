require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');

const PORT = parseInt(process.env.PORT, 10) || 5000;

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

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

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled Rejection - shutting down');
  shutdown();
});

startServer();