const { ApiError } = require('../error');

module.exports = log => (err, req, res, next) => {
  const logContent = {
    method: req.method,
    url: req.url,
    statusCode: err.statusCode || 500,
    message: err.message,
    err,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user,
  };
  if (req.headers && req.headers.requestId) {
    logContent.requestId = req.headers.requestId;
  }
  if (err.statusCode !== 401) {
    log.error(logContent);
  }

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

