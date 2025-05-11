import { Server } from 'http';
import app from './app';
import config from './app/config';
import logger from './app/utils/logger';

let server: Server;

async function main() {
  try {
    // Log application startup with a title
    logger.title('Server Starting');

    // Display environment information
    logger.info(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔌 Port: ${config.port}`);

    server = app.listen(config.port, () => {
      logger.title('Server Started Successfully');
      logger.info(`✅ Server is running at http://localhost:${config.port}`);
      logger.info(
        `📚 API Documentation: http://localhost:${config.port}/api-docs`,
      );
    });

    // Register shutdown handlers
    process.on('SIGTERM', () => {
      logger.title('Server Shutting Down');
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });

    process.on('SIGINT', () => {
      logger.title('Server Shutting Down');
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', error => {
      logger.error('Uncaught Exception', error);
      process.exit(1);
    });

    process.on('unhandledRejection', error => {
      logger.error('Unhandled Rejection', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
}

main();
