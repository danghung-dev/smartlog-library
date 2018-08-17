module.exports = class ApiError extends Error {
  constructor(errors, status, statusCode) {
    super();

    if (typeof errors === 'string' || errors instanceof String) {
      this.errors = [{
        message: errors,
      }];
    } else {
      this.errors = errors;
    }

    this.status = status;
    this.statusCode = statusCode || status;
    Error.captureStackTrace(this, this.constructor);
  }
};

