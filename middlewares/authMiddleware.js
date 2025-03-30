const User = require("../models/UserModel"); 

const authMiddleware = async (req, res, next) => {
    try {
        console.log("Сессия при запросе на обновление аватара:", req.session);
        if (!req.session.userId) {
            return res.status(401).json({ error: "Не авторизован" });
        }

        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: "Пользователь не найден" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports = authMiddleware;