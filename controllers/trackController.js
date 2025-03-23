const trackService = require('../services/trackService');

// Get all tracks
const getTracks = async (req, res) => {
  try {
    const tracks = await trackService.getAllTracks();
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Error fetching tracks' });
  }
};

// Get a specific track by ID
const getTrack = async (req, res) => {
  const { trackId } = req.params;
  
  try {
    const track = await trackService.getTrackById(trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ error: 'Error fetching track' });
  }
};

// Create a new track
const createTrack = async (req, res) => {
  const { title, artist, album, genre, filePath } = req.body;

  if (!title || !artist || !filePath) {
    return res.status(400).json({ error: 'Title, artist, and filePath are required' });
  }

  try {
    const trackData = { title, artist, album, genre, filePath };
    const newTrack = await trackService.createTrack(trackData);
    res.status(201).json(newTrack);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Error creating track' });
  }
};

module.exports = {
  getTracks,
  getTrack,
  createTrack,
};
