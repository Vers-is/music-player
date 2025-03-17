require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

const SECRET = process.env.JWT_SECRET || "secret_key";

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Введите имя пользователя и пароль" });
        }

        const normalizedUsername = username.trim().toLowerCase();

        const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [normalizedUsername]);
        if (existingUser.rowCount > 0) {
            return res.status(409).json({ error: "Пользователь уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [normalizedUsername, hashedPassword]);

        res.status(201).json({ message: "Пользователь создан" });
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const normalizedUsername = username.trim().toLowerCase();

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [normalizedUsername]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Неверное имя пользователя или пароль" });
        }

        const hashedPassword = user.rows[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Неверное имя пользователя или пароль" });
        }

        const token = jwt.sign({ username: normalizedUsername }, SECRET, { expiresIn: "1h" });

        res.json({ message: "Вход успешен!", token });
    } catch (error) {
        console.error("Ошибка входа:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Токен отсутствует" });

    jwt.verify(token.split(" ")[1], SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Недействительный токен" });
        req.user = user;
        next();
    });
};

app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Добро пожаловать, ${req.user.username}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
