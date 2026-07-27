require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');


const PORT = parseInt(process.env.PORT, 10) || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});


const shutdown = () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Closed remaining connections.');
    process.exit(0);
  });

  // Force shutdown if it takes longer than 10 seconds
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