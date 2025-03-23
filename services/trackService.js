const Track = require('../models/TrackModel');

const getAllTracks = async () => {
  try {
    return await Track.findAll();
  } catch (error) {
    throw new Error('Error fetching tracks');
  }
};

const getTrackById = async (trackId) => {
  try {
    return await Track.findByPk(trackId);
  } catch (error) {
    throw new Error('Error fetching track by ID');
  }
};

const createTrack = async (trackData) => {
  try {
    return await Track.create(trackData);
  } catch (error) {
    throw new Error('Error creating track');
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
};
