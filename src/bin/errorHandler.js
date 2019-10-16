const { NODE_ENV } = require('../config');
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message);
  const response =
    NODE_ENV === 'production'
      ? { error: { message: 'server error' } }
      : { message: err.message, error: err };
  return res.status(err.status ? err.status : 500).json(response);
}

module.exports = errorHandler;
