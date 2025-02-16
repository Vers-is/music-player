///////////////// WINDOW -- CREATE PLAYLIST //////////////////

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const openModal = document.getElementById("create-playlist");
  const closeModal = document.getElementById("closeModal");
  const coverInput = document.getElementById('cover-input');
  const coverPreview = document.getElementById('cover-preview');
  const saveButton = document.querySelector('.save-button');    const coverInput = document.getElementById('cover-input');
    const coverPreview = document.getElementById('cover-preview');
    const saveButton = document.querySelector('.save-button');

  openModal.addEventListener("click", () => {
      modal.style.display = "flex"; 
  });

  closeModal.addEventListener("click", () => {
      modal.style.display = "none"; 
      resetPreview();  
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
    localStorage.removeItem("loggedInUser"); 
    loggedInUser = null; 
    isAuthenticated = false;

    updateProfileIcon("default");
    updateProfileName("Гость");

    favorites = [];
    localStorage.removeItem("currentFavorites");
    
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(item => {
        item.innerHTML = "";
        item.style.height = "10vh";
    });

    renderFavorites();
    updateFavoriteUI();

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
    location.reload();
    loadFavorites();  
    renderFavorites(); 
    updateFavoriteUI(); 

} else {
    document.getElementById("errorMessage").style.display = "block";
}
}


function updateProfileName(username) {
  const profileName = document.getElementById("profileName");
  profileName.textContent = username && getUsers()[username] ? username : "Гость";
}

window.onload = function() {
  if (loggedInUser) {
      isAuthenticated = true;
      updateProfileIcon(loggedInUser);
      updateProfileName(loggedInUser);

      loadFavorites(); 
      renderFavorites();
      updateFavoriteUI(); 
  } else {
      isAuthenticated = false;
      updateProfileIcon("default");
      updateProfileName("Гость");
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

  ///////   CHARTS   ///////

  const charts = [
    { name: "В темноте", artist: "Noize MC", image: "/images/covers/charts/noize mc - nocomments.png", src: "/songs/charts/Noize MC - В темноте.mp3" },
    { name: "Душнила", artist: "idst", image: "/images/covers/charts/idst - Душнила.png", src: "/songs/charts/idst - Душнила.mp3" },
    { name: "Тут нужен я", artist: "Красные звезды", image: "/images/covers/charts/Красные звезды - Свобода2012.png", src: "/songs/charts/Красные Звёзды - Тут нужен я.mp3" },
    { name: "Семь восьмых", artist: "Ключевое слово", image: "/images/covers/charts/Ключевое слово - 78.png", src: "/songs/charts/Ключевое слово - Семь восьмых.mp3" },
    { name: "Creep", artist: "Radiohead", image: "/images/covers/charts/radiohead - pablohoney.png", src: "/songs/charts/Radiohead - Creep.mp3" },
    { name: "Мое море", artist: "Noize MC", image: "/images/covers/charts/noize mc - thegreatesrhits.png", src: "/songs/charts/Noize MC - Моё море.mp3" },
    { name: "Выдыхай", artist: "Noize MC", image: "/images/covers/charts/noize mc - thegreatesrhits.png", src: "/songs/charts/Noize MC - Выдыхай.mp3" },
    { name: "И это придёт", artist: "Гр. Полухутенко", image: "/images/covers/charts/полухутенко - ребра.png", src: "/songs/charts/Гр. Полухутенко - И это придёт.mp3" },
    { name: "Купидоны", artist: "Слава КПСС", image: "/images/covers/charts/слава кппс - лпнл.png", src: "/songs/charts/Слава КПСС - Купидоны.mp3" },
  ];
 
  const playIcons = document.querySelectorAll('.grid-item .play-icon');

playIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        const song = charts[index];
        playSongFromCharts(song, index);
    });
});

function playSongFromCharts(song, chartIndex) {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    const currentSongSrc = localStorage.getItem("songSrc");

    if (currentSongSrc === song.src && !audioPlayer.paused) {
        audioPlayer.pause();
        updateIcons(chartIndex, false);
        localStorage.setItem("isPlaying", "false");
        return;
    }

    songName.textContent = song.name;
    songArtist.textContent = song.artist;
    songImage.src = song.image;
    audioPlayer.src = song.src;
    audioPlayer.play().then(() => {
        updateIcons(chartIndex, true);
        localStorage.setItem("isPlaying", "true");
    }).catch((error) => {
        console.error("Ошибка при воспроизведении песни:", error);
    });

    localStorage.setItem("currentSongIndex", chartIndex);
    localStorage.setItem("songSrc", song.src);
    localStorage.setItem("songName", song.name);
    localStorage.setItem("songArtist", song.artist);

    updatePlayIcon(true);
}

function updateIcons(currentChartIndex, isPlaying) {
    playIcons.forEach((icon, index) => {
        if (index === currentChartIndex) {
            icon.src = isPlaying ? "/images/icons/pause-white.png" : "/images/icons/play-white.png";
        } else {
            icon.src = "/images/icons/play-white.png";
        }
    });
}

function updatePlayIcon(isPlaying) {
    playIcon.src = isPlaying ? "/images/icons/pause-white.png" : "/images/icons/play-white.png";
}

audioPlayer.addEventListener("pause", () => {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    updateIcons(currentSongIndex, false);
    updatePlayIcon(false);
});

audioPlayer.addEventListener("ended", () => {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    updateIcons(currentSongIndex, false);
    updatePlayIcon(false);
    localStorage.setItem("isPlaying", "false"); 
});
  
/////////////////

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

