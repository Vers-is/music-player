const ApiError = require("../utils/errorHandler");

module.exports = function(err, req, res, next) {
    console.error(err);
    
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            errors: err.errors
        });
    }
    
    return res.status(500).json({
        status: 500,
        message: "Внутренняя ошибка сервера"
    });
};