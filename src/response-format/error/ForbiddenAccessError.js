const ApiError = require('./ApiError');

module.exports = class ForbiddenAccessError extends ApiError {
  constructor(errors, statusCode) {
    super(errors, 403, statusCode);
  }
};

