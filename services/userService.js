const userModel = require("./models/userModel");
const ApiError = require("./utils/errorHandler");

class UserService {
    async getUserProfile(userId) {
        try {
            const user = await userModel.findById(userId);
            
            if (!user) {
                throw ApiError.notFound("Пользователь не найден");
            }
            
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.internal("Ошибка при получении профиля пользователя");
        }
    }
    
    async updateAvatar(userId, avatarPath) {
        try {
            const user = await userModel.updateAvatar(userId, avatarPath);
            
            if (!user) {
                throw ApiError.notFound("Пользователь не найден");
            }
            
            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.internal("Ошибка при обновлении аватара");
        }
    }
}

module.exports = new UserService();