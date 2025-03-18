// const express = require("express");
// const session = require("express-session");
// const cors = require("cors");

// const app = express();

// app.use(express.json());
// app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true })); // Указать адрес фронта
// app.use(session({
//     secret: "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false } 
// }));

// const users = {}; // Простая база данных (замени на PostgreSQL)

// app.post("/login", (req, res) => {
//     const { username, password } = req.body;

//     if (users[username] && users[username] === password) {
//         req.session.user = username; // Сохраняем в сессии
//         res.json({ message: "Вход успешен" });
//     } else {
//         res.status(401).json({ error: "Неверный логин или пароль" });
//     }
// });

// app.get("/user", (req, res) => {
//     if (req.session.user) {
//         res.json({ username: req.session.user });
//     } else {
//         res.status(401).json({ error: "Не авторизован" });
//     }
// });

// app.post("/logout", (req, res) => {
//     req.session.destroy(err => {
//         if (err) return res.status(500).json({ error: "Ошибка выхода" });
//         res.json({ message: "Выход выполнен" });
//     });
// });

// module.exports = app;

