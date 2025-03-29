const { Op } = require('sequelize');

class HistoryController {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.History = require('../models/HistoryModel')(sequelize);
    this.Track = require('../models/TrackModel')(sequelize);
    
    // Import user model with correct path
    this.User = require('../models/UserModel')
    
    // Set up model associations
    this.setupAssociations();
  }

  // Setup proper model associations
  setupAssociations() {
    // Make sure History has proper associations with Track
this.History.belongsTo(this.Track, { 
    foreignKey: 'trackId',
    targetKey: 'id',
    as: 'track' // опционально, для удобства
  });
    // Make sure History has proper associations with User
  this.History.belongsTo(this.User, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user'
  });
}
  // Add a track to user's history// historyController.js
async addToHistory(userId, trackId) {
  try {
    return await this.sequelize.transaction(async (t) => {
      const [entry] = await this.History.findOrCreate({
        where: { userId, trackId },
        defaults: { playCount: 1 },
        transaction: t
      });
      
      if (!entry.isNewRecord) {
        await entry.increment('playCount', { transaction: t });
        await entry.update({ playedAt: new Date() }, { transaction: t });
      }
      
      return entry.reload({ transaction: t });
    });
  } catch (error) {
    console.error('History transaction failed:', error);
    throw error;
  }
}

  // Get user's listening history
  async getUserHistory(userId, limit = 50) {
    try {
      return await this.History.findAll({
        where: { userId: userId },
        include: [
          {
            model: this.Track,
            attributes: ['id', 'name', 'artist', 'src', 'image']
          }
        ],
        order: [['playedAt', 'DESC']],
        limit: limit
      });
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  }

  // Get user's most played tracks
  async getMostPlayedTracks(userId, limit = 10) {
    try {
      return await this.History.findAll({
        where: { userId: userId },
        include: [
          {
            model: this.Track,
            attributes: ['id', 'name', 'artist', 'src', 'image']
          }
        ],
        order: [['playCount', 'DESC']],
        limit: limit
      });
    } catch (error) {
      console.error('Error fetching most played tracks:', error);
      throw error;
    }
  }

  // Clear user's history
  async clearHistory(userId) {
    try {
      return await this.History.destroy({
        where: { userId: userId }
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }
}

module.exports = HistoryController;