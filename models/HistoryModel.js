// models/HistoryModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const History = sequelize.define('History', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id'
      }
    },
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tracks', 
        key: 'id'
      }
    },
    playedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    playCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'history',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['trackId']
      },
      {
        fields: ['userId', 'trackId'],
        unique: true
      }
    ]
  });

  return History;
};