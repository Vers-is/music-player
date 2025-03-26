const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const checkFileExists = (filePath) => {
  try {
    // Удаляем /public из пути, если он есть
    const normalizedPath = filePath.startsWith('/public') 
      ? filePath.substring('/public'.length)
      : filePath;
    
    const fullPath = path.join(__dirname, '..', 'public', normalizedPath);
    return fs.existsSync(fullPath);
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err);
    return false;
  }
};

router.get('/', async (req, res) => {
  try {
    const tracks = await req.Track.findAll();
    
    const verifiedTracks = tracks.map(track => {
      const trackData = track.get({ plain: true });
      return {
        ...trackData,
        src: `http://localhost:3000/public${trackData.src.replace('/public', '')}`,
        image: `http://localhost:3000/public${trackData.image.replace('/public', '')}`,
        fileExists: checkFileExists(trackData.src) && checkFileExists(trackData.image)
      };
    });

    res.json(verifiedTracks);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;