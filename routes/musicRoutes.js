const { Router } = require("express");
const musicController = require("../controllers/musicController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

// Public routes
router.get("/tracks", musicController.getAllTracks);
router.get("/tracks/:id", musicController.getTrackById);

// Protected routes could be added here
// router.post("/favorites", authMiddleware, musicController.addToFavorites);

module.exports = router;