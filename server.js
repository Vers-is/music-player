const express = require("express");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require("cookie-parser");
const session = require("express-session"); // ✅ Добавляем express-session
const sequelize = require("./config/db.config");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Инициализация модели
const Track = require('./models/TrackModel')(sequelize);

// Middleware
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://127.0.0.1:5502"],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Добавляем поддержку сессий
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true, если используете HTTPS
    sameSite: "Lax"
  }
}));

// Добавление модели Track в запросы
app.use((req, res, next) => {
  req.Track = Track;
  next();
});

// Статические файлы
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp3')) {
      res.set('Content-Type', 'audio/mpeg');
    }
    if (filePath.endsWith('.jpeg') || filePath.endsWith('.jpg')) {
      res.set('Content-Type', 'image/jpeg');
    }
    if (filePath.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    if (filePath.endsWith('.webp')) {
      res.set('Content-Type', 'image/webp');
    }
  }
}));

// Явный маршрут для player.js
app.get('/player.js', (req, res) => {
  const filePath = path.join(__dirname, 'player.js');
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).send('File not found');
  }
  res.sendFile(filePath, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache'
    }
  });
});

// Импорт и подключение роутов (передаем sequelize)
const trackRoutes = require("./routes/trackRoutes")(sequelize); // Передаём sequelize
const userRoutes = require("./routes/userRoutes")
const historyRoutes = require("./routes/historyRoutes")(sequelize);

app.use("/api/history", historyRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/users", userRoutes);

// Проверка подключения и запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
      console.log(`Serving from: ${__dirname}`);
    });
  })
  .catch(err => {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  });
