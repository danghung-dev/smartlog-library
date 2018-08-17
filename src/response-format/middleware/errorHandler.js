const { ApiError } = require('../error');

module.exports = log => (err, req, res, next) => {
  log.error(`Internal error ${err.stack}`);

  if (req.app.get('env') !== 'development') {
    delete err.stack;
  }

  if (err instanceof ApiError) {
    return res.status(err.status || 500).json({
      statusCode: err.statusCode,
      errors: err.errors,
      stack: err.stack,
    });
  }

  // render the error page
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    statusCode,
    errors: [{ message: err.message }],
    stack: err.stack,
  });
};

