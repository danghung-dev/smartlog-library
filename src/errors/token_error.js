module.exports = class TokenError extends require('./app_error') {
  constructor(message) {
    // Providing default message and overriding status code.
    super(message || 'Token is invalid', 401);
  }
};
