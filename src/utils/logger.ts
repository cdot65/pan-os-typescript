import winston from 'winston';

const { combine, timestamp, json } = winston.format;

/**
 * Configured logger using Winston for application-level logging.
 * Provides tailored logging transports based on the runtime environment settings.
 * The logger is configured to log messages of 'info' level and above by default.
 * In non-production environments, it extends to log messages to the console for better accessibility and debugging.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    /**
     * Transport for persisting general logs in a file named 'combined.log'.
     * This file captures all logs of the level set in `LOG_LEVEL` and above.
     */
    new winston.transports.File({
      filename: 'combined.log',
    }),
    /**
     * Transport for persisting error-level logs in a file named 'app-error.log'.
     * This file specifically captures logs of 'error' level.
     */
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
    }),
  ],
});

/**
 * Extends the logger configuration to output logs to the console in non-production environments.
 * This extension aids in the debugging process during development by providing immediate log outputs to the console.
 * It utilizes colorization for readability and employs a simple format for clarity.
 */
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
