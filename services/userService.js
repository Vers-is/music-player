const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

class UserService {
    async register(username, password) {
        if (!username || !password) {
            throw new Error("Заполните все поля!");
        }
        if (password.length < 8) {
            throw new Error("Пароль должен содержать минимум 8 символов!");
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error("Пользователь с таким логином уже существует");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email: `${username}@example.com`,
            avatar: "/images/default.jpg",
            isAdmin: false,
        });

        return newUser;
    }

    async login(username, password) {
        if (!username || !password) {
            throw new Error("Заполните все поля!");
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error("Пользователь не найден");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Неверный пароль");
        }

        return user;
    }

    async updateAvatar(userId, avatarPath) {
        const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('Пользователь не найден');
            }
        user.avatar = avatarPath;
        await user.save();
        return user;
    }

    async getUserData(username) {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new Error('Пользователь не найден');
        }
        return user;
    }
    
    async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }
    return user;
}
}

module.exports = new UserService();
