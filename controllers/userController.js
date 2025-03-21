const userService = require("./services/userService");
const ApiError = require("./utils/errorHandler");

class UserController {
    async getUserProfile(req, res, next) {
        try {
            const user = await userService.getUserProfile(req.user.id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
    
    async updateAvatar(req, res, next) {
        try {
            if (!req.file) {
                return next(ApiError.badRequest("Файл не был загружен"));
            }
            
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            const user = await userService.updateAvatar(req.user.id, avatarPath);
            
            return res.json({
                avatar: user.avatar,
                message: "Аватар успешно обновлен"
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();