import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './app/config/swagger';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import logger from './app/utils/logger';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

// Logger middleware
app.use(logger.morganMiddleware);

// Swagger Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// API Documentation JSON endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
