const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db.config'); // Подключение к БД
const User = require('./models/UserModel');

const app = express();
const port = process.env.PORT || 3000;

// Обслуживание статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware для парсинга JSON
app.use(express.json());

// Настройка CORS
app.use(cors({
  origin: 'http://127.0.0.1:5502', // ваш фронтенд адрес
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Разрешаем использовать cookies
}));

// Проверка подключения к БД
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection error:', err));

// Создание таблиц (обновление схемы без удаления данных)
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synchronized'))
  .catch(err => console.error('❌ Error syncing tables:', err));

// Настройка Multer для загрузки аватаров
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars'); // Папка для хранения аватаров
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.username}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const extname = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith('image/') && allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Файл должен быть изображением с разрешением .jpg, .jpeg, .png или .gif'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Создаем папку для аватаров, если ее нет
const avatarsDir = 'uploads/avatars';
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Заполните все поля!' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Пароль должен содержать минимум 8 символов!' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email: `${username}@example.com`,
      avatar: '/images/default.jpg',
      isAdmin: false,
    });

    console.log('✅ Новый пользователь зарегистрирован:', newUser.dataValues);
    return res.status(201).json({ message: 'Регистрация успешна!' });
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление аватара
app.post('/updateAvatar', upload.single('avatar'), async (req, res) => {
    try {
        console.log('Request body:', req.body); // Логирование тела запроса
        console.log('Uploaded file:', req.file); // Логирование файла

        if (!req.file) {
            return res.status(400).json({ error: 'Файл не был загружен' });
        }

        const { username } = req.body;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        user.avatar = avatarPath;
        await user.save();

        res.json({ avatar: avatarPath });
    } catch (error) {
        console.error('Ошибка при обновлении аватара:', error);
        res.status(500).json({ error: error.message || 'Ошибка обновления аватара' });
    }
});

// Получение данных пользователя
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ username: user.username, avatar: user.avatar });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
// Логин пользователя
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Заполните все поля!' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    // Установите cookie или сессии, если необходимо
    // Например, для простоты можно установить cookies с флагом HttpOnly
    res.cookie('username', user.username, { httpOnly: true });

    res.json({ success: true, message: 'Авторизация успешна!' });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// Запуск сервера
app.listen(port, () => {
  console.log(`✅ Server is running on http://127.0.0.1:${port}`);
});
