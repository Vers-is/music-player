const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db.config");
const userRoutes = require("./routes/userRoutes");
const session = require('express-session');
require('dotenv').config();

const app = express(); // Инициализация приложения
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5502", 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Настройка сессий
app.use(session({
    secret: '220906',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Это важно, если ваше приложение работает без HTTPS
        maxAge: 60 * 60 * 1000 // например, срок действия сессии 1 час
    }
}));

const fs = require('fs');
const path = require('path');

// Add this to your server.js
const avatarDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}


app.use("/uploads", express.static("uploads"));

// Роуты
app.use("/api/users", userRoutes);

// Проверка подключения к БД
sequelize.authenticate()
    .then(() => console.log("✅ Database connected"))
    .catch(err => console.error("❌ Database connection error:", err));

sequelize.sync({ alter: true })
    .then(() => console.log("✅ Tables synchronized"))
    .catch(err => console.error("❌ Error syncing tables:", err));

app.listen(port, () => console.log(`✅ Server running on port ${port}`));


// // Получение списка песен
// app.get('/api/songs', async (req, res) => {
//   try {
//     if (!sequelize) {
//       throw new Error('Подключение к базе данных не установлено');
//     }
    
//     const songs = await sequelize.query('SELECT * FROM tracks', {
//       type: sequelize.QueryTypes.SELECT,
//     });

//     if (!songs.length) {
//       return res.status(404).json({ error: 'Песни не найдены' });
//     }

//     res.json(songs);
//   } catch (error) {
//     console.error('Ошибка при получении списка песен:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });



// ///////////// CREATE PLAYLIST 

// // Add these imports at the top of your server.js file
// const Playlist = require('./models/playlistModel');

// const PlaylistSong = require('./models/PlaylistSongModel');

// // Setup multer for playlist cover images
// const playlistCoverStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/playlist-covers');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `playlist-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const playlistCoverUpload = multer({ 
//   storage: playlistCoverStorage,
//   fileFilter
// });

// // Create directory for playlist covers if it doesn't exist
// const playlistCoversDir = 'uploads/playlist-covers';
// if (!fs.existsSync(playlistCoversDir)) {
//   fs.mkdirSync(playlistCoversDir, { recursive: true });
// }

// // Create a new playlist
// app.post('/api/playlists', playlistCoverUpload.single('coverImage'), async (req, res) => {
//   try {
//     const { name, description, username } = req.body;
    
//     if (!name || !username) {
//       return res.status(400).json({ error: 'Название плейлиста и имя пользователя обязательны' });
//     }

//     // Find user ID by username
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       return res.status(404).json({ error: 'Пользователь не найден' });
//     }

//     // Get cover image path if uploaded
//     let coverImagePath = '/images/playlist6.JPG';
//     if (req.file) {
//       coverImagePath = `/uploads/playlist-covers/${req.file.filename}`;
//     }

//     // Create the playlist
//     const playlist = await Playlist.create({
//       name,
//       description,
//       coverImage: coverImagePath,
//       userId: user.id
//     });

//     res.status(201).json({
//       id: playlist.id,
//       name: playlist.name,
//       description: playlist.description,
//       coverImage: playlist.coverImage
//     });
//   } catch (error) {
//     console.error('Ошибка при создании плейлиста:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Get all playlists for a user
// app.get('/api/playlists/:username', async (req, res) => {
//   try {
//     const { username } = req.params;
    
//     // Find user by username
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       return res.status(404).json({ error: 'Пользователь не найден' });
//     }
    
//     // Find all playlists for the user
//     const playlists = await Playlist.findAll({
//       where: { userId: user.id },
//       order: [['createdAt', 'DESC']]
//     });
    
//     res.json(playlists);
//   } catch (error) {
//     console.error('Ошибка при получении плейлистов:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Get a specific playlist with its songs
// app.get('/api/playlist/:playlistId', async (req, res) => {
//   try {
//     const { playlistId } = req.params;
    
//     // Find the playlist
//     const playlist = await Playlist.findByPk(playlistId);
//     if (!playlist) {
//       return res.status(404).json({ error: 'Плейлист не найден' });
//     }
    
//     // Find all songs in the playlist
//     const songs = await PlaylistSong.findAll({
//       where: { playlistId },
//       order: [['position', 'ASC']]
//     });
    
//     res.json({
//       id: playlist.id,
//       name: playlist.name,
//       description: playlist.description,
//       coverImage: playlist.coverImage,
//       songs
//     });
//   } catch (error) {
//     console.error('Ошибка при получении плейлиста:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Add a song to a playlist
// app.post('/api/playlist/:playlistId/songs', async (req, res) => {
//   try {
//     const { playlistId } = req.params;
//     const { songName, songArtist, songSrc, songImage } = req.body;
    
//     if (!songName || !songArtist || !songSrc || !songImage) {
//       return res.status(400).json({ error: 'Все данные о песне обязательны' });
//     }
    
//     // Check if playlist exists
//     const playlist = await Playlist.findByPk(playlistId);
//     if (!playlist) {
//       return res.status(404).json({ error: 'Плейлист не найден' });
//     }
    
//     // Get the highest current position
//     const lastSong = await PlaylistSong.findOne({
//       where: { playlistId },
//       order: [['position', 'DESC']]
//     });
    
//     const position = lastSong ? lastSong.position + 1 : 0;
    
//     // Add the song to the playlist
//     const playlistSong = await PlaylistSong.create({
//       playlistId,
//       songName,
//       songArtist,
//       songSrc,
//       songImage,
//       position
//     });
    
//     res.status(201).json(playlistSong);
//   } catch (error) {
//     console.error('Ошибка при добавлении песни в плейлист:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Remove a song from a playlist
// app.delete('/api/playlist/:playlistId/songs/:songId', async (req, res) => {
//   try {
//     const { playlistId, songId } = req.params;
    
//     // Find and delete the song
//     const song = await PlaylistSong.findOne({
//       where: {
//         id: songId,
//         playlistId
//       }
//     });
    
//     if (!song) {
//       return res.status(404).json({ error: 'Песня не найдена в плейлисте' });
//     }
    
//     await song.destroy();
    
//     // Reorder remaining songs
//     const remainingSongs = await PlaylistSong.findAll({
//       where: { playlistId },
//       order: [['position', 'ASC']]
//     });
    
//     for (let i = 0; i < remainingSongs.length; i++) {
//       remainingSongs[i].position = i;
//       await remainingSongs[i].save();
//     }
    
//     res.json({ message: 'Песня удалена из плейлиста' });
//   } catch (error) {
//     console.error('Ошибка при удалении песни из плейлиста:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Delete a playlist
// app.delete('/api/playlist/:playlistId', async (req, res) => {
//   try {
//     const { playlistId } = req.params;
    
//     // Find and delete the playlist
//     const playlist = await Playlist.findByPk(playlistId);
//     if (!playlist) {
//       return res.status(404).json({ error: 'Плейлист не найден' });
//     }
    
//     // Delete all songs in the playlist
//     await PlaylistSong.destroy({
//       where: { playlistId }
//     });
    
//     // Delete the playlist itself
//     await playlist.destroy();
    
//     res.json({ message: 'Плейлист удален' });
//   } catch (error) {
//     console.error('Ошибка при удалении плейлиста:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Update playlist order (reorder songs)
// app.put('/api/playlist/:playlistId/reorder', async (req, res) => {
//   try {
//     const { playlistId } = req.params;
//     const { songOrder } = req.body;
    
//     if (!Array.isArray(songOrder)) {
//       return res.status(400).json({ error: 'Неверный формат порядка песен' });
//     }
    
//     // Update positions for each song
//     for (const item of songOrder) {
//       await PlaylistSong.update(
//         { position: item.position },
//         { where: { id: item.id, playlistId } }
//       );
//     }
    
//     // Get updated song list
//     const songs = await PlaylistSong.findAll({
//       where: { playlistId },
//       order: [['position', 'ASC']]
//     });
    
//     res.json(songs);
//   } catch (error) {
//     console.error('Ошибка при изменении порядка песен:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });

// // Update playlist details
// app.put('/api/playlist/:playlistId', playlistCoverUpload.single('coverImage'), async (req, res) => {
//   try {
//     const { playlistId } = req.params;
//     const { name, description } = req.body;
    
//     // Find the playlist
//     const playlist = await Playlist.findByPk(playlistId);
//     if (!playlist) {
//       return res.status(404).json({ error: 'Плейлист не найден' });
//     }
    
//     // Update fields if provided
//     if (name) playlist.name = name;
//     if (description !== undefined) playlist.description = description;
    
//     // Update cover image if provided
//     if (req.file) {
//       playlist.coverImage = `/uploads/playlist-covers/${req.file.filename}`;
//     }
    
//     await playlist.save();
    
//     res.json(playlist);
//   } catch (error) {
//     console.error('Ошибка при обновлении плейлиста:', error);
//     res.status(500).json({ error: 'Ошибка сервера' });
//   }
// });