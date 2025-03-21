const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Подключение к базе данных

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: DataTypes.STRING
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users', // Указываем имя таблицы с маленькой буквы
  schema: 'public' // Указываем схему явно
});

module.exports = User;  // Экспорт модели

