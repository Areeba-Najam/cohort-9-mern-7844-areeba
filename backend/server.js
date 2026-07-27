require('dotenv').config();
const app = require('./src/app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled Rejection is shutting down');
  server.close(() => process.exit(1));
});