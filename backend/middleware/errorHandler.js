const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return ResponseHandler.badRequest(res, 'Duplicate entry found');
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED') {
    return ResponseHandler.error(res, 'Database connection failed', 503);
  }

  // Default error
  ResponseHandler.error(res, err);
};

module.exports = errorHandler;