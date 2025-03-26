class MusicPlayerModel {
  constructor() {
    this.songs = [];
    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.shuffledPlaylist = [];
    this.repeatMode = 0;
    this.volume = 1.0;
    this.currentTime = 0;
    this.duration = 0;
  }

  async fetchSongs() {
    try {
      const response = await fetch('http://localhost:3000/api/tracks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const tracks = await response.json();
      this.songs = tracks.filter(track => track.fileExists);
      return this.songs;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  }

  getCurrentSong() {
    if (this.songs.length === 0) return null;
    return this.isShuffle ? this.shuffledPlaylist[this.currentSongIndex] : this.songs[this.currentSongIndex];
  }

  nextSong() {
    if (this.songs.length === 0) return null;
    
    const playlist = this.isShuffle ? this.shuffledPlaylist : this.songs;
    this.currentSongIndex = (this.currentSongIndex + 1) % playlist.length;
    return this.getCurrentSong();
  }

  prevSong() {
    if (this.songs.length === 0) return null;
    
    const playlist = this.isShuffle ? this.shuffledPlaylist : this.songs;
    this.currentSongIndex = (this.currentSongIndex - 1 + playlist.length) % playlist.length;
    return this.getCurrentSong();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    if (this.isShuffle) {
      this.shuffledPlaylist = this.shuffleArray(this.songs);
      this.currentSongIndex = 0;
    } else {
      const currentSong = this.shuffledPlaylist[this.currentSongIndex];
      this.currentSongIndex = this.songs.findIndex(song => song.src === currentSong.src);
      if (this.currentSongIndex === -1) this.currentSongIndex = 0;
    }
    return this.isShuffle;
  }

  toggleRepeat() {
    this.repeatMode = (this.repeatMode + 1) % 3;
    return this.repeatMode;
  }

  setVolume(value) {
    this.volume = value;
    return this.volume;
  }

  setCurrentTime(value) {
    this.currentTime = value;
    return this.currentTime;
  }

  setDuration(value) {
    this.duration = value;
    return this.duration;
  }

  shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  saveToLocalStorage() {
    localStorage.setItem("currentSongIndex", this.currentSongIndex);
    localStorage.setItem("isPlaying", String(this.isPlaying));
    localStorage.setItem("currentTime", this.currentTime);
    localStorage.setItem("repeatMode", this.repeatMode);
    localStorage.setItem("isShuffle", String(this.isShuffle));
    localStorage.setItem("volume", this.volume);
    
    const currentSong = this.getCurrentSong();
    if (currentSong) {
      localStorage.setItem("songSrc", currentSong.src);
      localStorage.setItem("songName", currentSong.name);
      localStorage.setItem("songArtist", currentSong.artist);
    }
  }

  loadFromLocalStorage() {
    if (localStorage.getItem("currentSongIndex")) {
      this.currentSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
      this.isPlaying = localStorage.getItem("isPlaying") === "true";
      this.currentTime = parseFloat(localStorage.getItem("currentTime") || "0");
      this.repeatMode = parseInt(localStorage.getItem("repeatMode") || "0");
      this.isShuffle = localStorage.getItem("isShuffle") === "true";
      this.volume = parseFloat(localStorage.getItem("volume") || "1.0");
      
      if (this.isShuffle && this.songs.length > 0) {
        this.shuffledPlaylist = this.shuffleArray(this.songs);
      }
      
      return true;
    }
    return false;
  }
}