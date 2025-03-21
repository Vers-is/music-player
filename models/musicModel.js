const pool = require("../config/db.config");
const ApiError = require("../utils/errorHandler");

class MusicModel {
    async getAllTracks() {
        try {
            const query = `
                SELECT * FROM tracks
                ORDER BY title ASC
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw ApiError.internal("Ошибка при получении треков");
        }
    }

    async getTrackById(trackId) {
        try {
            const query = `
                SELECT * FROM tracks
                WHERE id = $1
            `;
            const result = await pool.query(query, [trackId]);
            
            if (result.rows.length === 0) {
                throw ApiError.notFound("Трек не найден");
            }
            
            return result.rows[0];
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.internal("Ошибка при получении трека");
        }
    }

    // Additional music-related methods can be added here
}

module.exports = new MusicModel();