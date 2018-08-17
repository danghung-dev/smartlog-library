const Joi = require('joi');
const { ApiError } = require('../error');

module.exports = (schema, type = 'query') => ({ query, body }, res, next) => {
  const data = type === 'query' ? query : body;
  const result = Joi.validate(data, schema);

  if (result.error) {
    return next(new ApiError(result.error.details, 400));
  }

  next();
};
