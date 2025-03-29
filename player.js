document.addEventListener("DOMContentLoaded", function () {
  console.log('Player script loaded'); 

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
  let isShuffle = false;
  let shuffledPlaylist = [];
  let currentSongIndex = 0;
  let isPlaying = false;
  let repeatMode = 0; // 0: no repeat, 1: repeat one, 2: repeat all
  let isMouseOverPlayer = false;
  let timeoutId;
  let currentTrack = null;


  // Helper functions
  function changeIconWithTransition(iconElement, newSrc) {
    iconElement.style.opacity = "0";
    setTimeout(() => {
      iconElement.src = newSrc;
      iconElement.style.opacity = "1";
    }, 10);
  }
function getCurrentUserId() {
  // Проверяем localStorage
  const fromStorage = localStorage.getItem('userId');
  if (fromStorage) {
    console.log('Found userId in localStorage:', fromStorage);
    return fromStorage;
  }
  
  // Проверяем cookies (нужно, если используется HTTP-only cookie)
  const cookies = document.cookie.split(';').map(c => c.trim());
  const userIdCookie = cookies.find(c => c.startsWith('userId='));
  if (userIdCookie) {
    const userId = userIdCookie.split('=')[1];
    console.log('Found userId in cookies:', userId);
    return userId;
  }
  
  console.warn('User ID not found in localStorage or cookies');
  return null;
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
  console.log("🔄 Вызов updateSongInfo()");
  
  if (!songs.length) {
    console.error("⚠ Ошибка: нет песен в songs[]!");
    currentTrack = null;
    return;
  }

  if (isShuffle && (!shuffledPlaylist || !shuffledPlaylist.length)) {
    console.warn("⚠ Включен shuffle, но shuffledPlaylist пуст! Отключаю shuffle.");
    isShuffle = false;
  }

  currentSongIndex = Math.max(0, Math.min(currentSongIndex, songs.length - 1));
  currentTrack = isShuffle ? shuffledPlaylist[currentSongIndex] : songs[currentSongIndex];

  if (!currentTrack) {
    console.error("❌ Ошибка: currentTrack не был установлен!");
    return;
  }

  console.log("✅ Текущий трек обновлён:", currentTrack);

  songName.textContent = currentTrack.name;
  songArtist.textContent = currentTrack.artist;
  songImage.src = currentTrack.image || "/images/default-cover.jpg";
  audioPlayer.src = currentTrack.src;
}



  async function addToHistory(trackId) {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.log('User not logged in, skipping history update');
        return;
      }

      console.log(`Adding to history - User: ${userId}, Track: ${trackId}`);

      const response = await fetch('/api/history/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          trackId: trackId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('History update failed:', error.message || error);
      } else {
        console.log('History successfully updated');
      }
    } catch (error) {
      console.error('Error updating history:', error);
    }
  }

window.playTrackById = function(trackId) {
  const trackIndex = songs.findIndex(song => song.id === trackId);
  if (trackIndex !== -1) {
    currentSongIndex = trackIndex;
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
      });
  }
};

let songs = [];

  // Load songs
  fetch('http://localhost:3000/api/tracks')
  .then(response => {
    console.log("🔄 Получен ответ от API:", response);
    return response.json();
  })
  .then(data => {
    console.log("✅ Данные треков:", data);
    songs = data.filter(track => track.fileExists?.audio);
    console.log("🎵 Загружено песен:", songs.length, songs);

    if (songs.length > 0) {
      currentSongIndex = 0;
      updateSongInfo();
      console.log("✅ Первый трек установлен:", currentTrack);
    } else {
      console.error("⚠ Нет доступных треков!");
    }
  })
  .catch(error => console.error("🚨 Ошибка загрузки треков:", error));


  // Event listeners
  playButton.addEventListener("click", () => {
  if (!currentTrack) {
    console.warn("⚠ Нет текущего трека! Устанавливаю первый...");
    if (songs.length > 0) {
      currentSongIndex = 0;
      updateSongInfo();
    } else {
      console.error("❌ Ошибка: в songs[] вообще нет треков!");
      return;
    }
  }

  if (audioPlayer.paused) {
    audioPlayer.play().catch(console.error);
  } else {
    audioPlayer.pause();
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

audioPlayer.addEventListener('play', async () => {
  console.log('[DEBUG] Play event triggered');
  
  if (!currentTrack) {
    console.error('No current track selected');
    return;
  }

  const userId = getCurrentUserId();
  console.log('[DEBUG] UserID:', userId, 'TrackID:', currentTrack.id);

  if (!userId) {
    console.log('User not authenticated, skipping history update');
    return;
  }

  try {
    console.log('[DEBUG] Sending history update:', {
      userId,
      trackId: currentTrack.id
    });

    const response = await fetch('/api/history/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: userId,
        trackId: currentTrack.id
      })
    });

    console.log('[DEBUG] Response status:', response.status);
    const data = await response.json();
    console.log('[DEBUG] Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update history');
    }
  } catch (error) {
    console.error('History update error:', error);
  }
});

audioPlayer.addEventListener("pause", () => {
  isPlaying = false; 
  hidePlayer(); 
});

audioPlayer.addEventListener("ended", () => {
  isPlaying = false; 
  hidePlayer();
});