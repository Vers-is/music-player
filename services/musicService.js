const musicModel = require("../models/musicModel");
const ApiError = require("../utils/errorHandler");

class MusicService {
    async getAllTracks() {
        try {
            return await musicModel.getAllTracks();
        } catch (error) {
            throw ApiError.internal("Ошибка при получении треков");
        }
    }
    
    async getTrackById(trackId) {
        try {
            return await musicModel.getTrackById(trackId);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.internal("Ошибка при получении трека");
        }
    }
    
    // Additional music-related service methods
}

module.exports = new MusicService();