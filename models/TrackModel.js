const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Track = sequelize.define('Track', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    src: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\/songs\/.+\.mp3$/i
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\/images\/.+\.(jpe?g|png|webp)$/i
      }
    }
  }, {
    tableName: 'tracks',
    timestamps: false,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['artist']
      }
    ]
  });

  return Track;
};