const winston = require('winston');

const defaultOptions = {
  file: {
    level: 'info',
    filename: process.env.LOG_PATH || `${__dirname}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

module.exports = (logOptions) => {
  const options = logOptions || defaultOptions;

  const logger = winston.createLogger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write(message, encoding) {
      logger.info(message);
    },
  };

  return logger;
};

