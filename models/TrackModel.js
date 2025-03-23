const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Track = sequelize.define('Track', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  album: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tracks',
  timestamps: true,
});

module.exports = Track;
