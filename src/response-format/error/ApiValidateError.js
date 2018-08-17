const ApiError = require('./ApiError');

module.exports = class ApiValidateError extends ApiError {
  constructor(errors, statusCode) {
    super(errors, 400, statusCode);
  }
};

