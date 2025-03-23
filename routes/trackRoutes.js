const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Get all tracks
router.get('/', trackController.getTracks);

// Get a specific track by ID
router.get('/:trackId', trackController.getTrack);

// Create a new track
router.post('/', trackController.createTrack);

module.exports = router;
