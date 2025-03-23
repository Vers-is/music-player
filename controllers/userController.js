const userService = require("../services/userService");

class UserController {
    async register(req, res) {
        try {
            const { username, password } = req.body;
            const user = await userService.register(username, password);
            res.status(201).json({ message: "Регистрация успешна!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
async login(req, res) {
    try {
        const { username, password } = req.body;
        console.log("Login request received:", { username, password }); // Логируем запрос

        const user = await userService.login(username, password);
        
        console.log("SUCCESSFUL LOGIN - User data:", {
            id: user.id,
            username: user.username
        });

        // Устанавливаем данные сессии
        req.session.userId = user.id;
        req.session.username = user.username;

        console.log("Session after setting values:", req.session);

        // Сохраняем сессию
        await new Promise((resolve, reject) => {
            req.session.save(err => {
                if (err) {
                    console.error("SESSION SAVE ERROR:", err);
                    reject(err);
                } else {
                    console.log("SESSION SAVED SUCCESSFULLY:", req.session);
                    resolve();
                }
            });
        });

        res.json({ success: true, message: "Авторизация успешна!" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(400).json({ error: error.message });
    }
}
    async updateAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Файл не был загружен" });
            }

            const userId = req.session.userId; // Используем userId из сессии
            const avatarPath = `/uploads/avatars/${req.file.filename}`;

            const user = await userService.updateAvatar(userId, avatarPath);
            res.json({ avatar: user.avatar, message: "Аватар успешно обновлен" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
        async getUserData(req, res) {
            try {
                const { username } = req.params;
                const user = await userService.getUserData(username);

                if (!user) {
                    return res.status(404).json({ error: "Пользователь не найден" });
                }

                res.json({ username: user.username, avatar: user.avatar });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        }
    async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    throw new Error("Ошибка при выходе из системы");
                }
                res.clearCookie("connect.sid");
                res.json({ success: true, message: "Выход выполнен успешно!" });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UserController();