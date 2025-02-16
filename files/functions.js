///////////////// WINDOW -- CREATE PLAYLIST //////////////////

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const openModal = document.getElementById("create-playlist");
  const closeModal = document.getElementById("closeModal");
  const coverInput = document.getElementById('cover-input');
  const coverPreview = document.getElementById('cover-preview');
  const saveButton = document.querySelector('.save-button');

  openModal.addEventListener("click", () => {
      modal.style.display = "flex"; 
  });

  closeModal.addEventListener("click", () => {
      modal.style.display = "none"; 
      resetPreview();  
  });

  window.addEventListener("click", (e) => {
      if (e.target === modal) {
          modal.style.display = "none";
          resetPreview();  
      }
  });

  if (coverInput && coverPreview) {
      coverInput.addEventListener('change', function(event) {
          const file = event.target.files[0]; 

          if (file) {
              const reader = new FileReader(); 

              reader.onload = function(e) {
                  coverPreview.src = e.target.result;
                  coverPreview.style.display = 'block'; 
              };

              reader.readAsDataURL(file);
          } 
      });
  }

  if (saveButton) {
      saveButton.addEventListener('click', () => {
          resetPreview();  
          modal.style.display = "none"; 
      });
  }

  function resetPreview() {
      coverPreview.style.display = 'none'; 
      coverPreview.src = ''; 
      coverInput.value = '';  
  }
});


///////////////// //////////////// //////////////////


///////////////// //////////////// STYLES FOR ACTIVE PAGE

const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav_links').forEach(link => {
  const linkHref = link.getAttribute('href');
  
  if (linkHref) {
      const linkPage = linkHref.split('/').pop(); 
      if (linkPage === currentPage) {
          link.classList.add('active');
      } else {
          link.classList.remove('active');
      }
  }
});
///////////////// WINDOW -- USERS //////////////////

let isAuthenticated = false;

const users = {
  "eldana": "220906",
  "vers": "12345",
};

let avatars = JSON.parse(localStorage.getItem("avatars")) || {
  "eldana": "/images/eldana.png",
  "vers": "/images/sasha.png",
  "default": "/images/default-avatar.png"
};

let loggedInUser = localStorage.getItem("loggedInUser") || null;

function updateProfileIcon(username) {
  const profileIcon = document.getElementById("profileIcon");
  const avatarSrc = avatars[username] || avatars["default"];

  profileIcon.style.backgroundImage = `url(${avatarSrc})`;
  profileIcon.style.backgroundSize = "cover";
  profileIcon.style.backgroundPosition = "center";
  profileIcon.style.backgroundRepeat = "no-repeat";
}

document.getElementById("profileIcon").addEventListener("click", () => {
  if (loggedInUser) {
      const menu = document.getElementById("profileMenu");
      menu.style.display = menu.style.display === "block" ? "none" : "block";
  } else {
      openLoginModal();
  }
});

window.addEventListener("click", (e) => {
  const menu = document.getElementById("profileMenu");
  if (!e.target.closest("#profileIcon") && !e.target.closest("#profileMenu")) {
      menu.style.display = "none";
  }
});

function logout() {
document.getElementById("profileMenu").style.display = "none";

const confirmLogout = confirm("Вы точно хотите выйти из аккаунта?");
if (confirmLogout) {
    localStorage.removeItem(`history_${loggedInUser}`); // Удаляем историю перед сбросом пользователя
    localStorage.removeItem("loggedInUser"); 
    loggedInUser = null; 
    isAuthenticated = false;

    updateProfileIcon("default");
    updateProfileName("Гость");

    favorites = [];
    localStorage.removeItem("currentFavorites");


    history = []; // Очищаем историю
    localStorage.removeItem("currentHistory");
    

    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(item => {
        item.innerHTML = "";
        item.style.height = "10vh";
    });

    renderFavorites();
    updateFavoriteUI();

    renderHistory(); 

    alert("Вы вышли из аккаунта.");
    location.reload();
}
}

document.getElementById("changeAvatar").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          avatars[loggedInUser] = e.target.result;
          localStorage.setItem("avatars", JSON.stringify(avatars));
          updateProfileIcon(loggedInUser);
      };
      reader.readAsDataURL(file);
  }
});

function openLoginModal() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("errorMessage").style.display = "none";
}

document.querySelector(".close-user").addEventListener("click", closeModal);

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function checkLogin() {
const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value.trim();

let users = getUsers();

if (users[username] && users[username] === password) {
    alert("Добро пожаловать, " + username + "!");
    loggedInUser = username;
    localStorage.setItem("loggedInUser", username); 

    updateProfileIcon(username);
    updateProfileName(username);
    isAuthenticated = true;

    closeModal();
    
    loadFavorites();  
    renderFavorites(); 
    updateFavoriteUI(); 

    loadHistory();  // Загружаем историю для пользователя
    renderHistory(); // Отображаем историю



} else {
    document.getElementById("errorMessage").style.display = "block";
}
}


function updateProfileName(username) {
  const profileName = document.getElementById("profileName");
  profileName.textContent = username && getUsers()[username] ? username : "Гость";
}

window.onload = function() {
    loggedInUser = getCurrentUser(); // Загружаем текущего пользователя

    if (loggedInUser) {
        isAuthenticated = true;
        updateProfileIcon(loggedInUser); // Устанавливаем аватарку
        updateProfileName(loggedInUser); // Устанавливаем никнейм

        loadFavorites(); 
        renderFavorites();
        updateFavoriteUI(); 

        loadHistory();  
        renderHistory();
    } else {
        isAuthenticated = false;
        updateProfileIcon("default"); // Показываем дефолтный аватар
        updateProfileName("Гость");

        history = []; 
        renderHistory();
    }
};


///////////////// PLAYER //////////////////

document.addEventListener("DOMContentLoaded", function () {
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

  const playIcon = playButton.querySelector("img"); 
  const repeatIcon = repeatButton.querySelector("img"); 
  const shuffleIcon = shuffleButton.querySelector("img"); 

  const songs = [
    {
    name: "Not Afraid",
    artist: "Eminem",
    src: "/songs/Eminem - No Afraid.mp3", 
    image: "/images/covers/eminem-notafraid.jpeg" 
  },
   {
    name: "Mockingbird",
    artist: "Eminem",
    src: "/songs/Eminem - Mockingbird.mp3",
    image: "/images/covers/eminem-mockinbird.jpeg"
  },
  {
    name: "Smack That",
    artist: "Eminem ft. Akon",
    src: "/songs/Eminem ft. Akon - Smack That.mp3",
    image: "/images/covers/smack-that.webp"
  },
  {
    name: "In Da Club",
    artist: "50 Cent",
    src: "/songs/50 Cent - In Da club.mp3",
    image: "/images/covers/50-indaclub.jpeg"
  },
  {
    name: "Ayo Technology",
    artist: "50 Cent",
    src: "/songs/50 Cent - Ayo Technology.mp3",
    image: "/images/covers/50-ayo.jpeg"
  },
  {
    name: "Blinding Lights",
    artist: "The Weeknd",
    src: "/songs/The Weeknd - Blinding Lights.mp3",
    image: "/images/covers/weeknd-blinding.png"
  },
   {
    name: "Call Out My Name",
    artist: "The Weeknd",
    src: "/songs/The Weeknd - Call Out My Name.mp3",
    image: "/images/covers/weeknd-call.jpeg"
  },
  {
    name: "Die For You",
    artist: "The Weeknd",
    src: "/songs/The Weeknd - Die For You (feat. Ariana Grande).mp3",
    image: "/images/covers/weeknd-starboy.jpeg"
  },
   {
    name: "Heartless",
    artist: "The Weeknd",
    src: "/songs/The Weeknd - Heartless.mp3",
    image: "/images/covers/weeknd-heartless.jpeg"
  },
   {
    name: "One Of The Girls",
    artist: "The Weeknd",
    src: "/songs/The Weeknd - One Of The Girls (Feat. JENNIE & Lily Rose Depp).mp3",
    image: "/images/covers/weeknd-girls.jpeg"
  },
  {
    name: "Интернет-свидание",
    artist: "Дора",
    src: "/songs/Дора  - Интернет-свидание.mp3",
    image: "/images/covers/дора-младшаясестра.png"
  },
  {
    name: "Задолбал меня игнорить",
    artist: "Дора",
    src: "/songs/Дора - Задолбал меня игнорить.mp3",
    image: "/images/covers/дора-младшаясестра.png"
  },
  {
    name: "почему?",
    artist: "Дора",
    src: "/songs/Дора - почему.mp3",
    image: "/images/covers/дора-янекоммерция.png"
  },
  {
    name: "725",
    artist: "Дора",
    src: "/songs/Дора - 725.mp3",
    image: "/images/covers/дора-янекоммерция.png"
  }
  ]

  function changeIconWithTransition(iconElement, newSrc) {
    iconElement.style.opacity = "0";
    setTimeout(() => {
      iconElement.src = newSrc;
      iconElement.style.opacity = "1";
    }, 10);
  }

  let isShuffle = false;
  let shuffledPlaylist = [];
  let currentSongIndex = 0;
  let isPlaying = false;

  function shuffleArray(array) {
    let shuffled = array.slice(); 
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;
    let newSrc = isShuffle ? "/images/icons/shuffle.png" : "/images/icons/no-shuffle-white.png";
    changeIconWithTransition(shuffleIcon, newSrc);

    if (isShuffle) {
      shuffledPlaylist = shuffleArray(songs);
      currentSongIndex = 0;
    } else {
      currentSongIndex = songs.findIndex(song => song.src === audioPlayer.src); 
    }
  });

  function updateSongInfo() {
    const song = isShuffle ? shuffledPlaylist[currentSongIndex] : songs[currentSongIndex];
    songName.textContent = song.name;
    songArtist.textContent = song.artist;
    songImage.src = song.image;
    audioPlayer.src = song.src;
    
    localStorage.setItem("currentSongIndex", currentSongIndex);
    localStorage.setItem("songSrc", song.src);
    localStorage.setItem("songName", song.name);
    localStorage.setItem("songArtist", song.artist);
  }

  window.addEventListener('storage', (event) => {
    if (event.key === "currentSongIndex" || event.key === "isPlaying" || event.key === "songSrc") {
      const newSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
      const newSongSrc = localStorage.getItem("songSrc");
      const newIsPlaying = localStorage.getItem("isPlaying") === "true";
      
      if (newSongIndex !== currentSongIndex || newSongSrc !== audioPlayer.src) {
        currentSongIndex = newSongIndex;
        updateSongInfo();
        if (newIsPlaying) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      }
    }
  });

  if (localStorage.getItem("currentSongIndex")) {
    currentSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
    let wasPlaying = localStorage.getItem("isPlaying") === "true"; 

    updateSongInfo(); 

    if (wasPlaying) {
      audioPlayer.play();
      playIcon.src = "/images/icons/pause-white.png"; 
    } else {
      isPlaying = false; 
      playIcon.src = "/images/icons/play-white.png"; 
    }
  } else {
    updateSongInfo();
  }

  audioPlayer.addEventListener("play", () => {
    isPlaying = true;
    localStorage.setItem("isPlaying", "true");
    showPlayer();
  });

  audioPlayer.addEventListener("pause", () => {
    isPlaying = false;
    localStorage.setItem("isPlaying", "false"); 
    hidePlayer();
  });

  nextButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % (isShuffle ? shuffledPlaylist.length : songs.length);
    updateSongInfo();
    audioPlayer.play();
    isPlaying = true;
    playIcon.src = "/images/icons/pause-white.png"; 
  });

  prevButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + (isShuffle ? shuffledPlaylist.length : songs.length)) % (isShuffle ? shuffledPlaylist.length : songs.length);
    updateSongInfo();
    audioPlayer.play();
    isPlaying = true;
    playIcon.src = "/images/icons/pause-white.png"; 
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("currentTime", audioPlayer.currentTime);
  });


  audioPlayer.addEventListener("ended", () => {
    if (repeatMode === 1) {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      isPlaying = true;
    } else if (repeatMode === 2) {
    } else { nextButton.click(); }
  });

  playButton.addEventListener("click", () => {
    if (audioPlayer.paused || audioPlayer.ended) {
      if (audioPlayer.ended) {
        audioPlayer.currentTime = 0; 
      }
      audioPlayer.play();
      isPlaying = true; 
      playIcon.src = "/images/icons/pause-white.png"; 
      localStorage.setItem("isPlaying", "true");
      showPlayer(); 
    } else {
      audioPlayer.pause();
      isPlaying = false; 
      playIcon.src = "/images/icons/play-white.png"; 
      localStorage.setItem("isPlaying", "false");
      hidePlayer(); 
    }
  });

  let repeatMode = 0; 

  repeatButton.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3; 

    let newSrc;
    switch (repeatMode) {
      case 0: 
        newSrc = "/images/icons/no-repeat-white.png";
        audioPlayer.loop = false;
        break;
      case 1:
        newSrc = "/images/icons/repeat-one-white.png";
        audioPlayer.loop = false; 
        break;
      case 2: 
        newSrc = "/images/icons/repeat-white.png";
        audioPlayer.loop = true; 
        break;
    }
    changeIconWithTransition(repeatIcon, newSrc);
  });

  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const totalDurationEl = document.getElementById("total-duration");

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !audioPlayer.paused) {
      playIcon.src = "/images/icons/pause-white.png"; 
    } else if (document.visibilityState !== "visible") {
      playIcon.src = "/images/icons/play-white.png"; 
    }
  });
  
  
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });
  if (localStorage.getItem("currentTime")) {
    audioPlayer.currentTime = parseFloat(localStorage.getItem("currentTime"));
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  }
  
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  
      localStorage.setItem("currentTime", audioPlayer.currentTime);
    }
  });
  

  audioPlayer.addEventListener("loadedmetadata", () => {
    totalDurationEl.textContent = formatTime(audioPlayer.duration);
  });

  progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
  });

  volumeControl.addEventListener("input", () => {
    audioPlayer.volume = volumeControl.value;
  });
if (localStorage.getItem("currentSongIndex")) {
    currentSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
    updateSongInfo();
    if (localStorage.getItem("isPlaying") === "true") {
      audioPlayer.play();
      playIcon.src = "/images/icons/pause-white.png"; 
    }
  } else {
    updateSongInfo();
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


////////////////// ADD TRACK TO FAVORITE 

document.addEventListener("DOMContentLoaded", () => {
  const favoriteBtn = document.querySelector(".favorite img");
  const loveSongIcon = document.querySelector(".love-song-icon");
  const favoritesList = document.querySelector(".favorites-list");

  let favorites = [];
  const loggedInUser = getCurrentUser(); 

  function getCurrentUser() {
      return localStorage.getItem("loggedInUser");
  }

  function getCurrentSong() {
      const songNameElement = document.getElementById("song-name");
      const songArtistElement = document.getElementById("song-artist");
      const songImageElement = document.getElementById("song-image");

      return {
          name: songNameElement?.textContent || "",
          artist: songArtistElement?.textContent || "",
          image: songImageElement?.src || "",
      };
  }

  function loadFavorites() {
      if (!loggedInUser) {
          favorites = [];
          return;
      }
      const allFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
      favorites = allFavorites[loggedInUser] || [];
  }

  function saveFavorites() {
      if (!loggedInUser) return;
      const allFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
      allFavorites[loggedInUser] = favorites;
      localStorage.setItem("favorites", JSON.stringify(allFavorites));
  }

  function isCurrentSongFavorite() {
      const currentSong = getCurrentSong();
      if (!currentSong) return false;
      return favorites.some((fav) => fav.name === currentSong.name && fav.artist === currentSong.artist);
  }

  function updateFavoriteUI() {
      const heartIcon = isCurrentSongFavorite() ? "/images/icons/heart-white-painted.png" : "/images/icons/heart-white.png";
      if (favoriteBtn) favoriteBtn.src = heartIcon;
      if (loveSongIcon) loveSongIcon.src = heartIcon;
  }

  function toggleFavorite() {
      const user = getCurrentUser();
      if (!user) {
          alert("Для начала авторизируйтесь");
          openLoginModal();
          return;
      }

      const currentSong = getCurrentSong();
      if (!currentSong) return;

      const index = favorites.findIndex((song) => song.name === currentSong.name && song.artist === currentSong.artist);
      if (index !== -1) {
          favorites.splice(index, 1); 
      } else {
          favorites.push(currentSong); 
      }

      saveFavorites(); 
      renderFavorites(); 
      updateFavoriteUI(); 
  }

  function renderFavorites() {
      if (!favoritesList) return;
      favoritesList.innerHTML = "";
      const maxSlots = 9;

      for (let i = 0; i < maxSlots; i++) {
          const song = favorites[i];
          const div = document.createElement("div");
          div.classList.add("grid-item");

          if (song) {
              div.innerHTML = `
                  <img src="${song.image}" alt="artist" class="track-artist-image">
                  <div class="item-info-cover">
                      <div class="track-info track-name-favorite">${song.name}</div>
                      <div class="track-info track-artist track-artist-favorite">${song.artist}</div>
                  </div>
                  <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
              `;
          } else {
              div.innerHTML = `
                  <div class="empty-slot" style="opacity: 0.1;">
                      <img src="/" class="track-artist-image" style="visibility: hidden;">
                      <div class="item-info-cover">
                          <div class="track-info track-name-favorite"></div>
                          <div class="track-info track-artist track-artist-favorite"></div>
                      </div>
                  </div>
              `;
          }

          favoritesList.appendChild(div);
      }
  }

  function handleSongChange() {
      updateFavoriteUI();
  }

  function init() {
      loadFavorites();
      updateFavoriteUI();
      renderFavorites();

      document.getElementById("next-btn")?.addEventListener("click", handleSongChange);
      document.getElementById("prev-btn")?.addEventListener("click", handleSongChange);
      document.getElementById("audio-player")?.addEventListener("ended", handleSongChange);
  }

  window.addEventListener("storage", (event) => {
      if (event.key === "favorites") {
          loadFavorites(); 
          updateFavoriteUI(); 
          renderFavorites(); 
      }
  });

  // Назначаем обработчики на кнопки
  [loveSongIcon, favoriteBtn].forEach((btn) => {
      if (btn) {
          btn.addEventListener("click", toggleFavorite);
      }
  });

  init();
});

  // localStorage.clear();


///////////////// HISTORY SECTION //////////////////

let history = [];

function getCurrentUser() {
    return localStorage.getItem("loggedInUser");
}

function getCurrentSong() {
    const songNameElement = document.getElementById("song-name");
    const songArtistElement = document.getElementById("song-artist");
    const songImageElement = document.getElementById("song-image");

    return {
        name: songNameElement?.textContent || "",
        artist: songArtistElement?.textContent || "",
        image: songImageElement?.src || "",
    };
}

function loadHistory() {
    loggedInUser = getCurrentUser(); // Гарантируем загрузку текущего пользователя
    if (!loggedInUser) {
        history = [];
        return;
    }
    const storedHistory = localStorage.getItem(`history_${loggedInUser}`);
    history = storedHistory ? JSON.parse(storedHistory) : [];
}

function saveHistory() {
    if (!loggedInUser) return;
    localStorage.setItem(`history_${loggedInUser}`, JSON.stringify(history));
}

function isCurrentSongHistory() {
    const currentSong = getCurrentSong();
    if (!currentSong.name || !currentSong.artist) return false;
    return history.some(song => song.name === currentSong.name && song.artist === currentSong.artist);
}

function toggleHistory() {
    loggedInUser = getCurrentUser(); // Получаем актуального пользователя
    if (!loggedInUser) return;

    const currentSong = getCurrentSong();
    if (!currentSong.name || !currentSong.artist) return;

    const index = history.findIndex(song => song.name === currentSong.name && song.artist === currentSong.artist);
    if (index !== -1) {
        history.splice(index, 1);
    } else {
        history.push(currentSong);
    }

    saveHistory();
    renderHistory();
}
// Функция для отображения истории
function renderHistory() {
    const historyContainer = document.querySelector(".history-container");
    if (!historyContainer) return;

    historyContainer.innerHTML = ""; // Очищаем контейнер
    const maxSlots = 9; // Максимальное количество слотов
    const displayedHistory = history.slice(0, maxSlots); // Берем первые 9 песен из истории

    // Отображаем песни из истории
    displayedHistory.forEach((song, index) => {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        gridItem.innerHTML = `
            <img src="${song.image}" alt="artist" class="track-artist-image">
            <div class="item-info-cover">
                <div class="track-info track-name-history">${song.name}</div>
                <div class="track-info track-artist track-artist-history">${song.artist}</div>
            </div>
            <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
        `;

        gridItem.addEventListener("click", () => {
            playSongFromHistory(index);
        });

        historyContainer.appendChild(gridItem);
    });

    // Добавляем пустые серые блоки, если история не заполнена
    for (let i = displayedHistory.length; i < maxSlots; i++) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("grid-item");

        gridItem.innerHTML = `
            <div class="empty-slot" style="opacity: 0.1;">
                <img src="/" class="track-artist-image" style="visibility: hidden;">
                <div class="item-info-cover">
                    <div class="track-info track-name-history"></div>
                    <div class="track-info track-artist track-artist-history"></div>
                </div>
            </div>
        `;

        historyContainer.appendChild(gridItem);
    }
}

// Добавляем песню в историю при воспроизведении
audioPlayer.addEventListener("play", () => {
    loggedInUser = getCurrentUser();
    if (!loggedInUser) return;

    const currentSong = getCurrentSong();
    if (!currentSong.name || !currentSong.artist) return;

    const songIndex = history.findIndex(song => 
        song.name === currentSong.name && song.artist === currentSong.artist
    );

    if (songIndex !== -1) {
        history.splice(songIndex, 1);
    }

    history.unshift(currentSong);

    if (history.length > 9) {
        history.pop();
    }

    saveHistory();
    renderHistory();
});

// Синхронизация истории между вкладками
window.addEventListener("load", function() {
    // Загрузка пользователя
    loggedInUser = localStorage.getItem("loggedInUser");
    console.log("Logged in user on load:", loggedInUser);

    if (loggedInUser) {
        updateProfileIcon(loggedInUser);
        updateProfileName(loggedInUser);
    } else {
        updateProfileIcon("default");
        updateProfileName("Гость");
    }

    // Загрузка истории
    loadHistory();
    renderHistory();

    // Загрузка избранного
    loadFavorites();
    renderFavorites();
});

// Загружаем историю при старте
window.onload = function() {
    loggedInUser = getCurrentUser();
    loadHistory();
    renderHistory();
};


//////////// ARTISTS - WINDOW //////////////
const artists = {
    "Eminem": {
        image: "/images/artists/eminem.jpeg",
        songs: [
            { title: "Lose Yourself", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Without Me", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Mockingbird", image: "/images/icons/atrist-prple-DEF.png" }
        ]
    },
    "The Weeknd": {
        image: "/images/artists/theweeknd.webp",
        songs: [
            { title: "Blinding Lights", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Save Your Tears", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Starboy", image: "/images/icons/atrist-prple-DEF.png" }
        ]
    },
        "Дора": {
        image: "/images/artists/dora.jpeg",
        songs: [
            { title: "Blinding Lights", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Save Your Tears", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Starboy", image: "/images/icons/atrist-prple-DEF.png" }
        ]
    },
        "50 Cent": {
        image: "/images/artists/50Cent.jpeg",
        songs: [
            { title: "Blinding Lights", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Save Your Tears", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Starboy", image: "/images/icons/atrist-prple-DEF.png" }
        ]
    },
        "Jax 02.14": {
        image: "/images/artists/jax.jpeg",
        songs: [
            { title: "Blinding Lights", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Save Your Tears", image: "/images/icons/atrist-prple-DEF.png" },
            { title: "Starboy", image: "/images/icons/atrist-prple-DEF.png" }
        ]
    },
    
    


};

function openArtistModal(artistName) {
    const modal = document.getElementById("artistModal");
    const artistImage = document.getElementById("artistImage");
    const artistTitle = document.getElementById("artistName");
    const songList = document.getElementById("songList");

    if (artists[artistName]) {
        artistTitle.textContent = artistName;
        artistImage.src = artists[artistName].image;
        songList.innerHTML = "";

        artists[artistName].songs.forEach(song => {
            const songItem = document.createElement("div");
            songItem.classList.add("grid-item");

            songItem.innerHTML = `
                <img src="${song.image}" alt="Song Image" class="track-artist-image">
                <div class="item-info-cover">
                    <div class="track-info track-name-history">${song.title}</div>
                    <div class="track-info track-artist track-artist-history">${artistName}</div>
                </div>
                <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
            `;

            songList.appendChild(songItem);
        });

        modal.style.display = "flex";
    }
}

function closeArtistModal() {
    document.getElementById("artistModal").style.display = "none";
}

// Добавляем обработчик событий для карточек артистов
document.querySelectorAll(".artist-card a").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const artistName = event.currentTarget.querySelector("p").textContent;
        openArtistModal(artistName);
    });
});




