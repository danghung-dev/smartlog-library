const ApiError = require('./ApiError');

module.exports = class NotFoundError extends ApiError {
  constructor(errors) {
    super(errors, 404);
  }
};

