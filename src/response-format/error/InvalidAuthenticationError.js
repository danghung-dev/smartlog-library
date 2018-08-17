const ApiError = require('./ApiError');

module.exports = class InvalidAuthenticationError extends ApiError {
  constructor(errors, statusCode) {
    super(errors, 401, statusCode);
  }
};

