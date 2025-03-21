const Joi = require("joi");
const ApiError = require("./errorHandler");

const schemas = {
    register: Joi.object({
        username: Joi.string().min(3).max(30).required()
            .messages({
                "string.min": "Имя пользователя должно содержать минимум 3 символа",
                "string.max": "Имя пользователя должно содержать максимум 30 символов", 
                "any.required": "Имя пользователя обязательно"
            }),
        password: Joi.string().min(8).required()
            .messages({
                "string.min": "Пароль должен содержать минимум 8 символов",
                "any.required": "Пароль обязателен"
            })
    }),

    login: Joi.object({
        username: Joi.string().required()
            .messages({
                "any.required": "Имя пользователя обязательно"
            }),
        password: Joi.string().required()
            .messages({
                "any.required": "Пароль обязателен"
            })
    }),

    updateUser: Joi.object({
        username: Joi.string().min(3).max(30),
        password: Joi.string().min(8)
    })
};

// Валидация данных через Joi
const validate = (schema) => (req, res, next) => {
    // Валидация данных
    const { error } = schemas[schema].validate(req.body);
    
    // Если есть ошибка
    if (error) {
        // Формируем массив с ошибками
        const errorMessages = error.details.map(detail => {
            return {
                field: detail.context.key,
                message: detail.message
            };
        });
        
        // Генерируем ошибку с деталями
        return next(ApiError.badRequest("Ошибка валидации", errorMessages));
    }
    
    // Если валидация прошла успешно, передаем управление дальше
    next();
};

module.exports = {
    validate
};
