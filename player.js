// /////////////// PLAYER //////////////////
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const playButton = document.getElementById("play-btn");
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const shuffleButton = document.getElementById("shuffle-btn");
  const repeatButton = document.getElementById("repeat-btn");
  const audioPlayer = document.getElementById("audio-player");
  const songName = document.getElementById("song-name");
  const songArtist = document.getElementById("song-artist");
  const songImage = document.getElementById("song-image");
  const volumeControl = document.getElementById("volume-control");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");
  const player = document.querySelector(".player");

  // Icons
  const playIcon = playButton.querySelector("img"); 
  const repeatIcon = repeatButton.querySelector("img"); 
  const shuffleIcon = shuffleButton.querySelector("img"); 

  // Player state
  let songs = [];
  let isShuffle = false;
  let shuffledPlaylist = [];
  let currentSongIndex = 0;
  let isPlaying = false;
  let repeatMode = 0; // 0: no repeat, 1: repeat one, 2: repeat all
  let isMouseOverPlayer = false;
  let timeoutId;

  // Helper functions
  function changeIconWithTransition(iconElement, newSrc) {
    iconElement.style.opacity = "0";
    setTimeout(() => {
      iconElement.src = newSrc;
      iconElement.style.opacity = "1";
    }, 10);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function shuffleArray(array) {
    let shuffled = array.slice(); 
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function updateSongInfo() {
    if (songs.length === 0) return;
    
    const song = isShuffle ? shuffledPlaylist[currentSongIndex] : songs[currentSongIndex];
    songName.textContent = song.name || "Unknown song";
    songArtist.textContent = song.artist || "Unknown artist";
    songImage.src = song.image || "/images/default-cover.jpg";
    audioPlayer.src = song.src || "";
    audioPlayer.currentTime = 0; // Сбрасываем время при переключении песни
    
    localStorage.setItem("currentSongIndex", currentSongIndex);
    localStorage.setItem("songSrc", song.src);
    localStorage.setItem("songName", song.name);
    localStorage.setItem("songArtist", song.artist);
  }

  // Load songs
  fetch('http://localhost:3000/api/tracks')
    .then(response => {
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      songs = data.filter(track => track.fileExists);
      console.log('Loaded songs:', songs);
      
      // Load saved state
      if (localStorage.getItem("currentSongIndex")) {
        currentSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
        isPlaying = localStorage.getItem("isPlaying") === "true";
        
        updateSongInfo();
        
        if (isPlaying) {
          audioPlayer.play().catch(e => console.error("Play error:", e));
          playIcon.src = "/images/icons/pause-white.png";
        }
      } else if (songs.length > 0) {
        updateSongInfo();
      }
    })
    .catch(error => {
      console.error('Error loading songs:', error);
      songName.textContent = "Error loading songs";
    });

  // Event listeners
  playButton.addEventListener("click", () => {
    if (audioPlayer.paused || audioPlayer.ended) {
      if (audioPlayer.ended) audioPlayer.currentTime = 0;
      audioPlayer.play()
        .then(() => {
          isPlaying = true;
          playIcon.src = "/images/icons/pause-white.png";
          localStorage.setItem("isPlaying", "true");
          showPlayer();
        })
        .catch(e => {
          console.error("Play error:", e);
          // Если ошибка воспроизведения, сбрасываем состояние
          isPlaying = false;
          playIcon.src = "/images/icons/play-white.png";
          localStorage.setItem("isPlaying", "false");
        });
    } else {
      audioPlayer.pause();
      isPlaying = false;
      playIcon.src = "/images/icons/play-white.png";
      localStorage.setItem("isPlaying", "false");
      hidePlayer();
    }
  });

  nextButton.addEventListener("click", () => {
    if (songs.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % (isShuffle ? shuffledPlaylist.length : songs.length);
    updateSongInfo();
    audioPlayer.play()
      .then(() => {
        isPlaying = true;
        playIcon.src = "/images/icons/pause-white.png";
        localStorage.setItem("isPlaying", "true");
        showPlayer();
      })
      .catch(e => {
        console.error("Play error:", e);
        isPlaying = false;
        playIcon.src = "/images/icons/play-white.png";
        localStorage.setItem("isPlaying", "false");
      });
  });

  prevButton.addEventListener("click", () => {
    if (songs.length === 0) return;
    
    currentSongIndex = (currentSongIndex - 1 + (isShuffle ? shuffledPlaylist.length : songs.length)) % 
                      (isShuffle ? shuffledPlaylist.length : songs.length);
    updateSongInfo();
    audioPlayer.play()
      .then(() => {
        isPlaying = true;
        playIcon.src = "/images/icons/pause-white.png";
        localStorage.setItem("isPlaying", "true");
        showPlayer();
      })
      .catch(e => {
        console.error("Play error:", e);
        isPlaying = false;
        playIcon.src = "/images/icons/play-white.png";
        localStorage.setItem("isPlaying", "false");
      });
  });

  shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleIcon.src = isShuffle ? "/images/icons/shuffle.png" : "/images/icons/no-shuffle-white.png";
    
    if (isShuffle) {
      shuffledPlaylist = shuffleArray(songs);
      currentSongIndex = 0;
    } else {
      const currentSong = shuffledPlaylist[currentSongIndex];
      currentSongIndex = songs.findIndex(song => song.src === currentSong.src);
      if (currentSongIndex === -1) currentSongIndex = 0;
    }
  });

  repeatButton.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;
    
    switch (repeatMode) {
      case 0:
        repeatIcon.src = "/images/icons/no-repeat-white.png";
        audioPlayer.loop = false;
        break;
      case 1:
        repeatIcon.src = "/images/icons/repeat-one-white.png";
        audioPlayer.loop = false;
        break;
      case 2:
        repeatIcon.src = "/images/icons/repeat-white.png";
        audioPlayer.loop = true;
        break;
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (repeatMode === 1) {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
    } else if (repeatMode === 0) {
      nextButton.click();
    }
    // Mode 2 (repeat all) is handled by audioPlayer.loop
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audioPlayer.duration);
    // Убрано восстановление времени воспроизведения
  });

  progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
  });

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = volumeControl.value;
    localStorage.setItem("volume", volumeControl.value);
  });
  // Load volume
  if (localStorage.getItem("volume")) {
    volumeControl.value = localStorage.getItem("volume");
    audioPlayer.volume = volumeControl.value;
  }
});
/////////////////// DISPLAY BOTTOM PLAYER

const player = document.querySelector(".player");
const audioPlayer = document.querySelector("audio"); 
let isMouseOverPlayer = false;
let isPlaying = false;
let timeoutId;

function showPlayer() {
clearTimeout(timeoutId); 
player.style.transform = "translateY(0)"; 
}

function hidePlayer() {
if (!isPlaying && !isMouseOverPlayer) {
  timeoutId = setTimeout(() => {
    player.style.transform = "translateY(100%)";
  }, 1000);
}
}

document.addEventListener("mousemove", (event) => {
const screenHeight = window.innerHeight;
const threshold = 90; 
if (event.clientY > screenHeight - threshold) {
  showPlayer();
} else if (!isPlaying) {
  hidePlayer();
}
});

player.addEventListener("mouseenter", () => {
isMouseOverPlayer = true;
showPlayer(); 
});

player.addEventListener("mouseleave", () => {
isMouseOverPlayer = false; 
hidePlayer(); 
});

audioPlayer.addEventListener("play", () => {
isPlaying = true;
showPlayer(); 
});

audioPlayer.addEventListener("pause", () => {
isPlaying = false; 
hidePlayer(); 
});

audioPlayer.addEventListener("ended", () => {
isPlaying = false; 
hidePlayer();
});