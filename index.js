const SimpleConsumer = require('./src/consumer');
const producer = require('./src/producer');
const { genericHandler } = require('./src/generic-handler');
const { permitRole, permitAction } = require('./src/auth');

const validate = require('./src/response-format/middleware/validate');

const Errors = require('./src/response-format/error');
const formatters = require('./src/response-format/formatter');

const errorHandlerMiddleware = require('./src/response-format/middleware/errorHandler');
const logger = require('./src/logger/index.js');
let log = require('./src/response-format/logger');

const errorHandler = (logOptions) => {
  log = log(logOptions);
  return errorHandlerMiddleware(logger);
};
module.exports = {
  consumer: new SimpleConsumer(),
  SimpleConsumer,
  producer,
  genericHandler,
  permitAction,
  permitRole,
  log,
  logger,
  validate,
  errorHandler,
  ...formatters,
  ...Errors,
};
