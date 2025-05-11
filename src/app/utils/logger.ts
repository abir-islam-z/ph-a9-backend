import { Request, Response } from 'express';
import morgan, { TokenIndexer } from 'morgan';
import winston from 'winston';
const { combine, timestamp, printf, colorize } = winston.format;

// Custom format for beautiful logs with capitalized messages
const beautifulFormat = printf(({ level, message, timestamp }) => {
  // Capitalize the first letter of each word in the message
  const capitalizedMessage =
    typeof message === 'string'
      ? message
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : message;

  // Format based on log level
  const icon = getLogIcon(level);
  const padding = ' '.repeat(2); // Consistent padding

  return `${timestamp} ${icon}${padding}${level.toUpperCase()}${padding}${capitalizedMessage}`;
});

// Add icons to different log levels for better visual recognition
function getLogIcon(level: string): string {
  switch (level.toLowerCase()) {
    case 'error':
      return '❌';
    case 'warn':
      return '⚠️';
    case 'info':
      return '📝';
    case 'debug':
      return '🔍';
    case 'verbose':
      return '🔊';
    default:
      return '➡️';
  }
}

// Create the logger with beautiful formatting
const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize({ all: true }),
    beautifulFormat,
  ),
  transports: [new winston.transports.Console()],
});

// Add a special method for title-style logs with separator lines
interface CustomLogger extends winston.Logger {
  // eslint-disable-next-line no-unused-vars
  title: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  morganMiddleware: any;
}

(logger as CustomLogger).title = (message: string) => {
  const separator =
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  logger.info(separator);
  logger.info(`🔰 ${message}`);
  logger.info(separator + '\n');
};

// Create a stream object with a write function that will be used by Morgan
const stream = {
  write: (message: string) => {
    // Remove the new line character at the end of Morgan logs
    const trimmedMessage = message.trim();
    logger.info(trimmedMessage);
  },
};

// Using combined format with our custom function
(logger as CustomLogger).morganMiddleware = morgan(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => {
    // Build our log string with emoji and colors
    return [
      '🌐',
      tokens.method?.(req, res),
      tokens.url?.(req, res),
      tokens.status?.(req, res),
      tokens.res?.(req, res, 'content-length'),
      '-',
      tokens['response-time']?.(req, res),
      'ms',
    ].join(' ');
  },
  {
    stream,
    // Skip logging for successful static content requests to reduce noise
    skip: (req: Request, res: Response): boolean => {
      return (
        res.statusCode < 400 &&
        !!req.path &&
        req.path.includes('/public/') === true
      );
    },
  },
);

export default logger as CustomLogger;
