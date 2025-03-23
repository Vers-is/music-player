// models/playlistSongModel.js
module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define('PlaylistSong', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    songName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songArtist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songSrc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playlistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  PlaylistSong.associate = (models) => {
    PlaylistSong.belongsTo(models.Playlist, { foreignKey: 'playlistId' });
  };

  return PlaylistSong;
};