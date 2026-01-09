// Standard API response format
class ResponseHandler {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, error, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: error.message || error
    });
  }

  static created(res, data, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, new Error(message), 404);
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, new Error(message), 400);
  }
}

module.exports = ResponseHandler;