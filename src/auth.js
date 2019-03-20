const jwt = require('jsonwebtoken');
const TokenError = require('./errors/token_error');

exports.permitRole = (...allowed) => (req, res, next) => {
  const secretKey = process.env.JWT_KEY || '';
  const isAllowed = role => allowed.indexOf(role) > -1;
  const token = req.headers.authorization ? req.headers.authorization.slice(7) : undefined || req.query.access_token || req.body.access_token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      next(new TokenError());
    } else {
      const allow = decoded.data.roles ? Object.keys(decoded.data.roles).find(key => isAllowed(key)) : undefined;
      if (allow || allowed === undefined || allowed.length == 0) {
        req.user = decoded.data;
        next();
      } else {
        next(new TokenError('Forbidden'));
      }
    }
  });
};

exports.permitAction = (...allowed) => (req, res, next) => {
  const secretKey = process.env.JWT_KEY || '';
  const isAllowed = action => allowed.indexOf(action) > -1;
  const token = req.headers.authorization ? req.headers.authorization.slice(7) : undefined || req.query.access_token || req.body.access_token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      next(new TokenError());
    } else {
      const allow = decoded.data.roles ? Object.entries(decoded.data.roles).find(e => e[1].find(act => isAllowed(act)) !== undefined) : undefined;

      if (allow || allowed === undefined || allowed.length == 0) {
        req.user = decoded.data;
        next();
      } else {
        next(new TokenError('Forbidden'));
      }
    }
  });
};

exports.permitRoleAction = (...allowed) => (req, res, next) => {
  const secretKey = process.env.JWT_KEY || '';
  const isAllowed = action => allowed.indexOf(action) > -1;
  const token = req.headers.authorization ? req.headers.authorization.slice(7) : undefined || req.query.access_token || req.body.access_token;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      next(new TokenError());
    } else {
      // Role
      const allowRole = decoded.data.roles ? Object.keys(decoded.data.roles).find(key => isAllowed(key)) : undefined;
      // Action
      const allowAction = decoded.data.roles ? Object.entries(decoded.data.roles).find(e => e[1].find(act => isAllowed(act)) !== undefined) : undefined;

      if (allowRole || allowAction || allowed === undefined || allowed.length == 0) {
        req.user = decoded.data;
        next();
      } else {
        next(new TokenError('Forbidden'));
      }
    }
  });
};
