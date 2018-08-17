const ApiError = require('./ApiError');

module.exports = class ConflictedModificationError extends ApiError {
  constructor(errors, statusCode) {
    super(errors, 409, statusCode);
  }
};

