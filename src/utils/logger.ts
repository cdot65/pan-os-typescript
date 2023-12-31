import winston from 'winston';

const { combine, timestamp, json } = winston.format;

/**
 * A configured logger using Winston for application-level logging.
 * It provides different logging transports based on the runtime environment.
 * By default, logs 'info' and above level messages. In non-production environments,
 * it also logs to the console.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    // Transport for persisting general logs in combined.log
    new winston.transports.File({
      filename: 'combined.log',
    }),
    // Transport for persisting error level logs in app-error.log
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
    }),
  ],
});

// Extends the logger configuration for non-production environments.
if (process.env.NODE_ENV !== 'production') {
  // In non-production environments, logs are additionally output to the console.
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adds color to the output for improved readability.
        winston.format.simple(), // Uses a simple logging format.
      ),
    }),
  );
}

export default logger;
