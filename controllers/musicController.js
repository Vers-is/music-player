const musicService = require("../services/musicService");

class MusicController {
    async getAllTracks(req, res, next) {
        try {
            const tracks = await musicService.getAllTracks();
            return res.json(tracks);
        } catch (error) {
            next(error);
        }
    }
    
    async getTrackById(req, res, next) {
        try {
            const { id } = req.params;
            const track = await musicService.getTrackById(id);
            return res.json(track);
        } catch (error) {
            next(error);
        }
    }
    
    // Additional music controller methods
}

module.exports = new MusicController();