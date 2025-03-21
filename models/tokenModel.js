const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Token = sequelize.define('Token', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Token;