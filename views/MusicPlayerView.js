class MusicPlayerView {
  constructor(model, container) {
    this.model = model;
    this.container = container || document;
    
    this.player = document.querySelector('.player');
    this.playButton = document.getElementById('play-btn');
    this.prevButton = document.getElementById('prev-btn');
    this.nextButton = document.getElementById('next-btn');
    this.shuffleButton = document.getElementById('shuffle-btn');
    this.repeatButton = document.getElementById('repeat-btn');
    this.volumeSlider = document.getElementById('volume-control');
    this.progressBar = document.getElementById('progress-bar');
    this.songTitle = document.getElementById('song-name');
    this.artistName = document.getElementById('song-artist');
    this.coverImage = document.getElementById('song-image');
    this.audio = document.getElementById('audio-player');
    this.currentTimeDisplay = document.getElementById('current-time');
    this.totalDurationDisplay = document.getElementById('total-duration');
  }
  
  bindPlayButton(handler) {
    this.playButton.addEventListener('click', handler);
  }
  
  bindPrevButton(handler) {
    this.prevButton.addEventListener('click', handler);
  }
  
  bindNextButton(handler) {
    this.nextButton.addEventListener('click', handler);
  }
  
  bindShuffleButton(handler) {
    this.shuffleButton.addEventListener('click', handler);
  }
  
  bindRepeatButton(handler) {
    this.repeatButton.addEventListener('click', handler);
  }
  
  bindVolumeControl(handler) {
    this.volumeSlider.addEventListener('input', handler);
  }
  
  bindProgressBar(handler) {
    this.progressBar.addEventListener('input', handler);
  }
  
  bindAudioEvents(onPlay, onPause, onEnded, onTimeUpdate, onMetadataLoaded) {
    this.audio.addEventListener('play', onPlay);
    this.audio.addEventListener('pause', onPause);
    this.audio.addEventListener('ended', onEnded);
    this.audio.addEventListener('timeupdate', onTimeUpdate);
    this.audio.addEventListener('loadedmetadata', onMetadataLoaded);
  }
  
  updateSong(song) {
    if (!song) return;
    
    this.songTitle.textContent = song.name || 'Неизвестный трек';
    this.artistName.textContent = song.artist || 'Неизвестный исполнитель';
    this.coverImage.src = song.image || 'http://localhost:3000/public/images/default-cover.jpg';
    this.audio.src = song.src || '';
    
    this.audio.load();
  }
  
  updatePlayIcon(isPlaying) {
    const playImage = this.playButton.querySelector('img');
    playImage.src = isPlaying ? '/images/icons/pause-white.png' : '/images/icons/play-white.png';
  }
  
  updateShuffleIcon(isShuffle) {
    const shuffleImage = this.shuffleButton.querySelector('img');
    shuffleImage.style.opacity = isShuffle ? '1' : '0.5';
  }
  
  updateRepeatIcon(repeatMode) {
    const repeatImage = this.repeatButton.querySelector('img');
    repeatImage.style.opacity = repeatMode === 0 ? '0.5' : '1';
  }
  
  updateProgressBar(currentTime, duration) {
    if (isNaN(duration) || duration === 0) return;
    const progress = (currentTime / duration) * 100;
    this.progressBar.value = progress;
  }
  
  updateTimeDisplay(currentTime, duration) {
    this.currentTimeDisplay.textContent = this.formatTime(currentTime);
    this.totalDurationDisplay.textContent = this.formatTime(duration);
  }
  
  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  showPlayer() {
    this.player.style.transform = 'translateY(0)';
  }
  
  hidePlayer() {
    this.player.style.transform = 'translateY(100%)';
  }
  
  render() {
    const song = this.model.getCurrentSong();
    if (song) {
      this.updateSong(song);
      this.updatePlayIcon(this.model.isPlaying);
      this.updateShuffleIcon(this.model.isShuffle);
      this.updateRepeatIcon(this.model.repeatMode);
      
      this.audio.volume = this.model.volume;
      this.volumeSlider.value = this.model.volume;
      
      if (this.model.currentTime > 0) {
        this.audio.currentTime = this.model.currentTime;
        this.updateProgressBar(this.model.currentTime, this.model.duration);
        this.updateTimeDisplay(this.model.currentTime, this.model.duration);
      }
    }
  }
}