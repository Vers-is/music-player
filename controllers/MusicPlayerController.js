class MusicPlayerController {
  constructor(model, view, userId) {
    this.model = model;
    this.view = view;
    this.isMouseOverPlayer = false;
    this.timeoutId = null;
    this.init();
    this.userId = userId; 
  }

  init() {
    this.bindEvents();
  }

async addTrackToHistory(trackId) {
  try {
    if (!this.userId) {
      console.warn('No user ID provided, skipping history tracking');
      return;
    }

    console.log(`Sending track to history: ${trackId}`);

    const response = await fetch('/api/history/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.userId,
        trackId: trackId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to add track to history:', errorData);
    }
  } catch (error) {
    console.error('Error adding track to history:', error);
  }
}

  bindEvents() {
    this.view.bindPlayButton(() => this.handlePlayButton());
    this.view.bindPrevButton(() => this.handlePrevButton());
    this.view.bindNextButton(() => this.handleNextButton());
    this.view.bindShuffleButton(() => this.handleShuffleButton());
    this.view.bindRepeatButton(() => this.handleRepeatButton());
    
    this.view.bindVolumeControl(e => this.handleVolumeChange(e));
    this.view.bindProgressBar(e => this.handleProgressChange(e));
    
    this.view.bindAudioEvents(
      () => this.handleAudioPlay(),
      () => this.handleAudioPause(),
      () => this.handleAudioEnded(),
      () => this.handleTimeUpdate(),
      () => this.handleMetadataLoaded()
    );
    
    this.bindPlayerVisibilityEvents();
    
    window.addEventListener('storage', (event) => this.handleStorageEvent(event));
    window.addEventListener("beforeunload", () => this.model.saveToLocalStorage());
  }

  bindPlayerVisibilityEvents() {
    document.addEventListener("mousemove", (event) => {
      const screenHeight = window.innerHeight;
      const threshold = 90;
      
      if (event.clientY > screenHeight - threshold) {
        this.showPlayer();
      } else if (!this.model.isPlaying) {
        this.hidePlayer();
      }
    });
    
    this.view.player.addEventListener("mouseenter", () => {
      this.isMouseOverPlayer = true;
      this.showPlayer();
    });
    
    this.view.player.addEventListener("mouseleave", () => {
      this.isMouseOverPlayer = false;
      this.hidePlayer();
    });
    
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && this.model.isPlaying) {
        this.view.updatePlayIcon(true);
      } else if (document.visibilityState !== "visible") {
        this.view.updatePlayIcon(false);
      }
    });
  }

handlePlayButton() {
    if (this.view.audio.paused || this.view.audio.ended) {
        if (this.view.audio.ended) {
            this.view.audio.currentTime = 0;
        }
        this.view.audio.play().catch(e => console.error("Error playing audio:", e));
        this.model.isPlaying = true;
        this.view.updatePlayIcon(true);
        this.showPlayer();
        
        // Ensure the track is added to history when played
        this.addTrackToHistory(this.model.getCurrentSong().id);
    } else {
        this.view.audio.pause();
        this.model.isPlaying = false;
        this.view.updatePlayIcon(false);
        this.hidePlayer();
    }

    this.model.saveToLocalStorage();
}


  handleNextButton() {
    const nextSong = this.model.nextSong();
    this.view.updateSong(nextSong);
    this.view.audio.play().catch(e => console.error("Error playing audio:", e));
    this.model.isPlaying = true;
    this.view.updatePlayIcon(true);
    this.model.saveToLocalStorage();
    
    // Add track to history
    this.addTrackToHistory(nextSong.id);
  }

    handlePrevButton() {
    const prevSong = this.model.prevSong();
    this.view.updateSong(prevSong);
    this.view.audio.play().catch(e => console.error("Error playing audio:", e));
    this.model.isPlaying = true;
    this.view.updatePlayIcon(true);
    this.model.saveToLocalStorage();
    
    // Add track to history
    this.addTrackToHistory(prevSong.id);
  }

  handleShuffleButton() {
    const shuffleState = this.model.toggleShuffle();
    this.view.updateShuffleIcon(shuffleState);
    this.view.updateSong(this.model.getCurrentSong());
    this.model.saveToLocalStorage();
  }

  handleRepeatButton() {
    const repeatMode = this.model.toggleRepeat();
    this.view.updateRepeatIcon(repeatMode);
    this.model.saveToLocalStorage();
  }

  handleVolumeChange(event) {
    const volume = event.target.value;
    this.model.setVolume(volume);
    this.view.audio.volume = volume;
    this.model.saveToLocalStorage();
  }

  handleProgressChange(event) {
    const progress = event.target.value;
    const newTime = (progress / 100) * this.view.audio.duration;
    this.view.audio.currentTime = newTime;
    this.model.setCurrentTime(newTime);
  }

  handleAudioPlay() {
    this.model.isPlaying = true;
    this.view.updatePlayIcon(true);
    this.showPlayer();
    this.model.saveToLocalStorage();
  }

  handleAudioPause() {
    this.model.isPlaying = false;
    this.view.updatePlayIcon(false);
    this.hidePlayer();
    this.model.saveToLocalStorage();
  }

  handleAudioEnded() {
    if (this.model.repeatMode === 1) {
      this.view.audio.currentTime = 0;
      this.view.audio.play().catch(e => console.error("Error playing audio:", e));
      this.model.isPlaying = true;
    } else if (this.model.repeatMode === 2) {
      // Already handled by audio loop property
    } else {
      this.handleNextButton();
    }
  }

  handleTimeUpdate() {
    const currentTime = this.view.audio.currentTime;
    const duration = this.view.audio.duration;
    
    this.model.setCurrentTime(currentTime);
    this.view.updateProgressBar(currentTime, duration);
    this.model.saveToLocalStorage();
  }

  handleMetadataLoaded() {
    const duration = this.view.audio.duration;
    this.model.setDuration(duration);
    this.view.updateProgressBar(this.view.audio.currentTime, duration);
  }

  handleStorageEvent(event) {
    if (event.key === "currentSongIndex" || event.key === "isPlaying" || event.key === "songSrc") {
      const wasState = this.model.loadFromLocalStorage();
      
      if (wasState) {
        this.view.updateSong(this.model.getCurrentSong());
        this.view.audio.currentTime = this.model.currentTime;
        
        if (this.model.isPlaying) {
          this.view.audio.play().catch(e => console.error("Error playing audio:", e));
        } else {
          this.view.audio.pause();
        }
        
        this.view.updatePlayIcon(this.model.isPlaying);
        this.view.updateShuffleIcon(this.model.isShuffle);
        this.view.updateRepeatIcon(this.model.repeatMode);
      }
    }
  }

  showPlayer() {
    clearTimeout(this.timeoutId);
    this.view.showPlayer();
  }

  hidePlayer() {
    if (!this.model.isPlaying && !this.isMouseOverPlayer) {
      this.timeoutId = setTimeout(() => {
        this.view.hidePlayer();
      }, 1000);
    }
  }
  
}