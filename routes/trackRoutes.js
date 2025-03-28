const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

module.exports = (sequelize) => {
  const Track = require('../models/TrackModel')(sequelize);

  const checkFileExists = (filePath) => {
    try {
      // Удаляем начальный /public из пути, если он есть
      const normalizedPath = filePath.startsWith('/public/') 
        ? filePath.substring('/public/'.length)
        : filePath.startsWith('public/')
          ? filePath.substring('public/'.length)
          : filePath;
      
      const fullPath = path.join(__dirname, '..', 'public', normalizedPath);
      const exists = fs.existsSync(fullPath);
      
      if (!exists) {
        console.log(`File not found: ${fullPath}`);
      }
      
      return exists;
    } catch (err) {
      console.error(`Error checking file ${filePath}:`, err);
      return false;
    }
  };

  router.get('/', async (req, res) => {
    try {
      const tracks = await Track.findAll();
      
      const verifiedTracks = await Promise.all(tracks.map(async (track) => {
        const trackData = track.get({ plain: true });
        
        // Проверяем существование файлов
        const audioExists = checkFileExists(trackData.src);
        const imageExists = checkFileExists(trackData.image);
        
        return {
          ...trackData,
          fileExists: {
            audio: audioExists,
            image: imageExists
          }
        };
      }));

      res.json(verifiedTracks);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      });
    }
  });

  return router;
};