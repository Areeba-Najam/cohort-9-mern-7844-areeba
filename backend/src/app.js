const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const logger = require('./config/logger');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(pinoHttp({ logger }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});
app.use(notFoundHandler);
app.use(globalErrorHandler);


module.exports = app;