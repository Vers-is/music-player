require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Подключение к базе данных PostgreSQL
const pool = new Pool({
    user: "eldana",
    host: "localhost",
    database: "music_player",
    password: "220906", 
    port: 5432,
});


app.use(cors());
app.use(express.json());

// Регистрация нового пользователя
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    try {
        // Проверяем, есть ли уже такой пользователь
        const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "Пользователь уже существует" });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Добавляем пользователя в базу данных
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]);

        console.log("Зарегистрирован новый пользователь:", username); // Логируем имя пользователя
        res.json({ message: "Регистрация успешна" });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Авторизация пользователя
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    try {
        const userResult = await pool.query("SELECT username, password, avatar FROM users WHERE username = $1", [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        }

        const user = userResult.rows[0];

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        }

        console.log("Вход выполнен для пользователя:", user.username);
        res.json({ message: "Вход успешен", username: user.username, avatar: user.avatar });
    } catch (error) {
        console.error("Ошибка при входе:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

pool.connect()
    .then(() => console.log("✅ Успешное подключение к базе данных"))
    .catch((err) => console.error("❌ Ошибка подключения к БД:", err));

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${port}`);
});


app.get("/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const user = userResult.rows[0];
        res.json({ username: user.username, avatar: user.avatar }); // Добавьте поле avatar в таблицу users, если нужно
    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});
