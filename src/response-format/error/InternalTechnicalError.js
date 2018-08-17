const ApiError = require('./ApiError');

module.exports = class InternalTechnicalError extends ApiError {
  constructor(errors, statusCode) {
    super(errors, 500, statusCode);
  }
};

