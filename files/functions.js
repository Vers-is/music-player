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
    })

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

//////////////// ADD TRACK TO FAVORITE //////////////////

document.addEventListener("DOMContentLoaded", () => {
  const favoriteBtn = document.querySelector(".favorite img");
  const loveSongIcon = document.querySelector(".love-song-icon");
  const favoritesList = document.querySelector(".favorites-list");
  const audioPlayer = document.getElementById("audio-player");
  const songName = document.getElementById("song-name");
  const songArtist = document.getElementById("song-artist");
  const songImage = document.getElementById("song-image");
  const playPauseBtn = document.getElementById("play-pause-btn"); // Кнопка плей/пауза в нижнем плеере

  let favorites = [];
  const loggedInUser = getCurrentUser(); 

  function getCurrentUser() {
      return localStorage.getItem("loggedInUser");
  }

  function getCurrentSong() {
      return {
          name: songName?.textContent || "",
          artist: songArtist?.textContent || "",
          image: songImage?.src || "",
          src: audioPlayer?.src || "" 
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
      if (!currentSong.name) return;

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
                  <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon" data-index="${i}">
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

      // Добавляем обработчики событий для кнопок воспроизведения
      const favoritePlayIcons = favoritesList.querySelectorAll('.play-icon');
      favoritePlayIcons.forEach((icon) => {
          icon.addEventListener('click', () => {
              const index = parseInt(icon.getAttribute("data-index"));
              if (favorites[index]) {
                  playSongFromFavorites(favorites[index], index);
              }
          });
      });
  }
function playSongFromFavorites(song, favoriteIndex) {
    if (!audioPlayer) return;

    const isCurrentlyPlaying = !audioPlayer.paused && audioPlayer.src === song.src;

    if (isCurrentlyPlaying) {
        audioPlayer.pause();
        updateFavoriteUI(-1);
        updatePlayPauseButton(false); // Обновляем иконку в нижнем плеере
        localStorage.setItem("isPlaying", "false");
        return;
    }

    // Обновляем нижний плеер
    songName.textContent = song.name;
    songArtist.textContent = song.artist;
    songImage.src = song.image;
    audioPlayer.src = song.src;

    audioPlayer.play().then(() => {
        updateFavoriteUI(favoriteIndex);
        updatePlayPauseButton(true); // Теперь кнопка внизу тоже обновляется
        localStorage.setItem("isPlaying", "true");

        updateBottomPlayerUI(song);
    }).catch((error) => {
        console.error("Ошибка воспроизведения:", error);
    });

    localStorage.setItem("currentSongIndex", favoriteIndex);
    localStorage.setItem("songSrc", song.src);

    updatePlayPauseButton(true);
}

// ✅ Функция для обновления UI нижнего плеера
function updateBottomPlayerUI(song) {
    songName.textContent = song.name;
    songArtist.textContent = song.artist;
    songImage.src = song.image;
}

  function updateFavoriteIcons(currentFavoriteIndex) {
      const favoritePlayIcons = favoritesList.querySelectorAll('.play-icon');
      favoritePlayIcons.forEach((icon, index) => {
          icon.src = (index === currentFavoriteIndex && !audioPlayer.paused) 
              ? "/images/icons/pause-white.png" 
              : "/images/icons/play-white.png";
      });
  }

  // Функция для обновления иконки плей/пауза в нижнем плеере
  function updatePlayPauseButton(isPlaying) {
      if (playPauseBtn) {
          playPauseBtn.src = isPlaying 
              ? "/images/icons/pause-white.png" 
              : "/images/icons/play-white.png";
      }
  }

  audioPlayer.addEventListener("play", () => {
      const currentSongIndex = parseInt(localStorage.getItem("currentSongIndex"));
      updateFavoriteIcons(currentSongIndex);
      updatePlayPauseButton(true); // Обновляем иконку в нижнем плеере
  });

  audioPlayer.addEventListener("pause", () => {
      updateFavoriteIcons(-1);
      updatePlayPauseButton(false); // Обновляем иконку в нижнем плеере
  });

  audioPlayer.addEventListener("ended", () => {
      updateFavoriteIcons(-1);
      updatePlayPauseButton(false); // Обновляем иконку в нижнем плеере
      localStorage.setItem("isPlaying", "false");
  });

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

  [loveSongIcon, favoriteBtn].forEach((btn) => {
      if (btn) {
          btn.addEventListener("click", toggleFavorite);
      }
  });

  init();
});

//////////////// HISTORY SECTION //////////////////

async function fetchUserHistory(userId) {
  try {
    const response = await fetch(`/api/history?userId=${userId}`);
    const history = await response.json();
    // Render history in your UI
  } catch (error) {
    console.error('Error fetching history:', error);
  }
}

async function fetchMostPlayedTracks(userId) {
  try {
    const response = await fetch(`/api/history/most-played?userId=${userId}`);
    const mostPlayedTracks = await response.json();
    // Render most played tracks in your UI
  } catch (error) {
    console.error('Error fetching most played tracks:', error);
  }
}

// Добавить эти функции
function getCurrentUserId() {
  return localStorage.getItem('userId') || 
         document.cookie.match(/userId=([^;]+)/)?.[1];
}

async function loadUserHistory() {
  try {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    const response = await fetch(`/api/history?userId=${userId}`);
    const history = await response.json();
    
    const container = document.querySelector('.history-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    history.forEach(item => {
      const track = item.Track;
      const itemHTML = `
        <div class="grid-item" data-track-id="${track.id}">
          <img src="${track.image || '/images/icons/atrist-prple-DEF.png'}" 
               alt="${track.artist}" class="track-artist-image">
          <div class="item-info-cover">
            <div class="track-info track-name-history">${track.name}</div>
            <div class="track-info track-artist track-artist-history">${track.artist}</div>
          </div>
          <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
        </div>
      `;
      container.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Добавить обработчики кликов для элементов истории
    container.querySelectorAll('.grid-item').forEach(item => {
      item.addEventListener('click', function() {
        const trackId = this.getAttribute('data-track-id');
        playTrackById(trackId);
      });
    });
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
  }
}

// Вызывать при загрузке страницы и после входа пользователя
document.addEventListener('DOMContentLoaded', loadUserHistory);

// let history = [];

// function getCurrentUser() {
//     return localStorage.getItem("loggedInUser");
// }

// function getCurrentSong() {
//     const songNameElement = document.getElementById("song-name");
//     const songArtistElement = document.getElementById("song-artist");
//     const songImageElement = document.getElementById("song-image");

//     return {
//         name: songNameElement?.textContent || "",
//         artist: songArtistElement?.textContent || "",
//         image: songImageElement?.src || "",
//         src: audioPlayer.src || "" // Добавляем источник аудиофайла
//     };
// }

// function loadHistory() {
//     loggedInUser = getCurrentUser(); 
//     if (!loggedInUser) {
//         history = [];
//         return;
//     }
//     const storedHistory = localStorage.getItem(`history_${loggedInUser}`);
//     history = storedHistory ? JSON.parse(storedHistory) : [];
// }

// function saveHistory() {
//     if (!loggedInUser) return;
//     localStorage.setItem(`history_${loggedInUser}`, JSON.stringify(history));
// }

// function isCurrentSongHistory() {
//     const currentSong = getCurrentSong();
//     if (!currentSong.name || !currentSong.artist) return false;
//     return history.some(song => song.name === currentSong.name && song.artist === currentSong.artist);
// }

// function toggleHistory() {
//     loggedInUser = getCurrentUser(); 
//     if (!loggedInUser) return;

//     const currentSong = getCurrentSong();
//     if (!currentSong.name || !currentSong.artist) return;

//     const index = history.findIndex(song => song.name === currentSong.name && song.artist === currentSong.artist);
//     if (index !== -1) {
//         history.splice(index, 1);
//     } else {
//         history.push(currentSong);
//     }

//     saveHistory();
//     renderHistory();
// }
// function renderHistory() {
//     const historyContainer = document.querySelector(".history-container");
//     if (!historyContainer) return;

//     historyContainer.innerHTML = ""; 
//     const maxSlots = 9;
//     const displayedHistory = history.slice(0, maxSlots); 

//     displayedHistory.forEach((song, index) => {
//         const gridItem = document.createElement("div");
//         gridItem.classList.add("grid-item");

//         gridItem.innerHTML = `
//             <img src="${song.image}" alt="artist" class="track-artist-image">
//             <div class="item-info-cover">
//                 <div class="track-info track-name-history">${song.name}</div>
//                 <div class="track-info track-artist track-artist-history">${song.artist}</div>
//             </div>
//             <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon" data-index="${index}">
//         `;

//         // Добавляем обработчик события для кнопки воспроизведения
//         const playIcon = gridItem.querySelector(".play-icon");
//         playIcon.addEventListener("click", (event) => {
//             event.stopPropagation(); // Предотвращаем всплытие события
//             const index = parseInt(playIcon.getAttribute("data-index"));
//             if (!isNaN(index) && history[index]) {
//                 playSongFromHistory(index);
//             }
//         });

//         historyContainer.appendChild(gridItem);
//     });

//     // Добавляем пустые слоты, если песен меньше maxSlots
//     for (let i = displayedHistory.length; i < maxSlots; i++) {
//         const gridItem = document.createElement("div");
//         gridItem.classList.add("grid-item");

//         gridItem.innerHTML = `
//             <div class="empty-slot" style="opacity: 0.1;">
//                 <img src="/" class="track-artist-image" style="visibility: hidden;">
//                 <div class="item-info-cover">
//                     <div class="track-info track-name-history"></div>
//                     <div class="track-info track-artist track-artist-history"></div>
//                 </div>
//             </div>
//         `;

//         historyContainer.appendChild(gridItem);
//     }
// }
// audioPlayer.addEventListener("play", () => {
//     loggedInUser = getCurrentUser();
//     if (!loggedInUser) return;

//     const currentSong = getCurrentSong();
//     if (!currentSong.name || !currentSong.artist) return;

//     const songIndex = history.findIndex(song => 
//         song.name === currentSong.name && song.artist === currentSong.artist
//     );

//     if (songIndex !== -1) {
//         history.splice(songIndex, 1);
//     }

//     history.unshift(currentSong);

//     if (history.length > 9) {
//         history.pop();
//     }

//     saveHistory();
//     renderHistory();
// });

// window.addEventListener("load", function() {
//     loggedInUser = localStorage.getItem("loggedInUser");
//     console.log("Logged in user on load:", loggedInUser);

//     if (loggedInUser) {
//         updateProfileIcon(loggedInUser);
//         updateProfileName(loggedInUser);
//     } else {
//         updateProfileIcon("default");
//         updateProfileName("Гость");
//     }

//     loadHistory();
//     renderHistory();

//     loadFavorites();
//     renderFavorites();
// });

// window.onload = function() {
//     loggedInUser = getCurrentUser();
//     loadHistory();
//     renderHistory();
// };
// function playSongFromHistory(index) {
//     const song = history[index];
//     if (!song || !audioPlayer) return;

//     if (!song.src) {
//         console.error("Нет источника аудио для этой песни:", song);
//         return;
//     }

//     const isCurrentlyPlaying = !audioPlayer.paused && audioPlayer.src === song.src;

//     if (isCurrentlyPlaying) {
//         audioPlayer.pause();
//         updatePlayPauseButton(false);
//         updateHistoryIcons(-1); // Обновляем иконки, убирая активную
//         localStorage.setItem("isPlaying", "false");
//         return;
//     }

//     // Обновляем нижний плеер
//     document.getElementById("song-name").textContent = song.name;
//     document.getElementById("song-artist").textContent = song.artist;
//     document.getElementById("song-image").src = song.image;
//     audioPlayer.src = song.src;

//     audioPlayer.play().then(() => {
//         updatePlayPauseButton(true);
//         updateHistoryIcons(index); // Обновляем иконку в истории
//         localStorage.setItem("isPlaying", "true");
//     }).catch((error) => {
//         console.error("Ошибка воспроизведения:", error);
//     });

//     localStorage.setItem("currentSongIndex", index);
//     localStorage.setItem("songSrc", song.src);
// }
// function updateHistoryIcons() {
//     const playIcons = document.querySelectorAll(".play-icon");

//     playIcons.forEach((icon, index) => {
//         if (index === 0) { // Только первая песня в истории получает иконку "пауза"
//             icon.src = "/images/icons/pause-white.png";
//         } else {
//             icon.src = "/images/icons/play-white.png";
//         }
//     });
// }
// function updatePlayPauseButton(isPlaying) {
//     const playPauseBtn = document.getElementById("play-pause-btn");
//     if (playPauseBtn) {
//         playPauseBtn.src = isPlaying 
//             ? "/images/icons/pause-white.png" 
//             : "/images/icons/play-white.png";
//     }
// }
// audioPlayer.addEventListener("play", () => {
//     updatePlayPauseButton(true); // Обновляем иконку плей/пауза в нижнем плеере
//     localStorage.setItem("isPlaying", "true");
// });

// audioPlayer.addEventListener("pause", () => {
//     updatePlayPauseButton(false);
//     updateHistoryIcons(-1); // Сбрасываем иконки в истории
//     localStorage.setItem("isPlaying", "false");
// });

// audioPlayer.addEventListener("ended", () => {
//     updatePlayPauseButton(false);
//     updateHistoryIcons(-1); // Сбрасываем иконки в истории
//     localStorage.setItem("isPlaying", "false");
// });




//////////// ARTISTS - WINDOW //////////////
const artists = {
    "Eminem": {
        image: "/images/artists/eminem.jpeg",
        songs: [
            { name: "Rap God", image: "/images/covers/rapgod.jpeg", src: "/songs/Eminem - Rap God.mp3" },
            { name: "Love The Way You Lie", image: "/images/covers/lovetheway.jpeg", src: "/songs/Rihanna Feat. Eminem - Love The Way You Lie.mp3"},
            { name: "Not Afraid", image: "/images/covers/eminem-notafraid.jpeg", src: "/songs/Eminem---No-Afraid.mp3" }
        ],
      },
    "The Weeknd": {
        image: "/images/artists/theweeknd.webp",
        songs: [
            { name: "Starboy", image: "/images/covers/weeknd-starboy.jpeg", src: "/songs/The Weeknd feat. Daft Punk - Starboy.mp3" },
            { name: "Blinding Lights", image: "/images/covers/weeknd-blinding.png", src: "/songs/The-Weeknd---Blinding-Lights.mp3" },
            { name: "Pray For Me", image: "/images/covers/Pray-for-Me.jpg.webp", src: "/songs/The Weeknd & Kendrick Lamar - Pray For Me.mp3" }
        ]
    },
        "Дора": {
        image: "/images/artists/dora.jpeg",
        songs: [
           { name: "Втюрилась", image: "/images/covers/дора-втюрилась.jpeg", src: "/songs/Дора - Втюрилась.mp3" },
            { name: "Дорадура", image: "/images/covers/дорадура.jpeg", src: "/songs/Дора - Дорадура.mp3" },
            { name: "Интернет-свидание", image: "/images/covers/дора-младшаясестра.png", src: "/songs/Дора----Интернет-свидание.mp3" }
        ]
    },
         "50 Cent": {
        image: "/images/artists/50Cent.jpeg",
        songs: [
           { name: "In Da Club", image: "/images/covers/50-indaclub.jpeg", src: "/songs/50-Cent---In-Da-Club.mp3" },
            { name: "Candy Shop", image: "/images/covers/candyshop.jpeg", src: "/songs/50 Cent - Candy Shop (Feat. Olivia).mp3" },
            { name: "Just A Lil Bit", image: "/images/covers/justalil.jpeg", src: "/songs/50 Cent - Just A Lil Bit.mp3" }
        ]
    },
         "Jax 02.14": {
        image: "/images/artists/jax.jpeg",
        songs: [
           { name: "Ким Билет", image: "/images/covers/kimbilet.jpeg", src: "/songs/Jax 02.14 - Kim Bilet.mp3" },
            { name: "Sebelep", image: "/images/covers/sebelep.webp", src: "/songs/Jax (02.14) - Sebelep.mp3" },
            { name: "Коюп Кой", image: "/images/artists/jax album.jpeg", src: "/songs/Jax (02.14) - Коюп Кой.mp3" }
        ]
    }
  }
let currentAudio = null;
let currentPlayIcon = null;
const artistPlayIcons = new Map();

function openArtistModal(artistName) {
    const modal = document.getElementById("artistModal");
    const artistImage = document.getElementById("artistImage");
    const artistTitle = document.getElementById("artistName");
    const popularSongs = document.getElementById("popularSongs");

    if (artists[artistName]) {
        artistTitle.textContent = artistName;
        artistImage.src = artists[artistName].image;
        popularSongs.innerHTML = "";
        artistPlayIcons.clear();

        artists[artistName].songs.slice(0, 3).forEach((song, index) => {
            const songItem = createSongItem(song, artistName, index);
            popularSongs.appendChild(songItem);
        });

        modal.style.display = "flex";
    }
}

function closeArtistModal() {
    document.getElementById("artistModal").style.display = "none";
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        localStorage.setItem("isPlaying", "false");
    }
}

function createSongItem(song, artistName, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("grid-item");

    songItem.innerHTML = `
        <img src="${song.image}" alt="Song Image" class="track-artist-image">
        <div class="item-info-cover">
            <div class="track-info track-name-history">${song.name}</div>
            <div class="track-info track-artist track-artist-history">${artistName}</div>
        </div>
        <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
    `;

    const playIcon = songItem.querySelector(".play-icon");
    artistPlayIcons.set(index, playIcon);

    playIcon.addEventListener("click", (event) => {
        event.stopPropagation(); 
        playSongFromArtist(song, index);
    });

    return songItem;
}

function playSongFromArtist(song, songIndex) {
    const currentSongSrc = localStorage.getItem("songSrc");

    // Найдём текущего исполнителя по песне
    let artistName = "Unknown Artist";
    for (const [key, value] of Object.entries(artists)) {
        if (value.songs.includes(song)) {
            artistName = key;
            break;
        }
    }

    // Если песня уже играет, ставим на паузу
    if (currentSongSrc === song.src && !audioPlayer.paused) {
        audioPlayer.pause();
        updateIcons(songIndex, false);
        localStorage.setItem("isPlaying", "false");
        return;
    }

    // Устанавливаем новую песню в глобальном плеере
    audioPlayer.src = song.src;
    audioPlayer.play().then(() => {
        updateIcons(songIndex, true);
        localStorage.setItem("isPlaying", "true");
    }).catch(err => console.error("Error playing audio:", err));

    // Обновляем информацию в нижнем плеере
    document.getElementById("song-image").src = song.image;
    document.getElementById("song-name").textContent = song.name;
    document.getElementById("song-artist").textContent = artistName;

    // Сохраняем текущую песню в localStorage
    localStorage.setItem("currentSongIndex", songIndex);
    localStorage.setItem("songSrc", song.src);
    localStorage.setItem("songName", song.name);
    localStorage.setItem("songArtist", artistName);
}

function updateIcons(currentSongIndex, isPlaying) {
    // Обновляем иконки в модальном окне
    artistPlayIcons.forEach((icon, index) => {
        icon.src = index === currentSongIndex && isPlaying 
            ? "/images/icons/pause-white.png" 
            : "/images/icons/play-white.png";
    });

    // Обновляем иконку в нижнем плеере
    const bottomPlayIcon = document.getElementById("bottomPlayIcon");
    if (bottomPlayIcon) {
        bottomPlayIcon.src = isPlaying 
            ? "/images/icons/pause-white.png" 
            : "/images/icons/play-white.png";
    }
}

audioPlayer.addEventListener("play", () => {
    updateIcons(localStorage.getItem("currentSongIndex"), true);
    localStorage.setItem("isPlaying", "true");

    // Обновляем верхний плеер
    updateTopPlayer();
});

audioPlayer.addEventListener("pause", () => {
    updateIcons(localStorage.getItem("currentSongIndex"), false);
    localStorage.setItem("isPlaying", "false");

    // Обновляем верхний плеер
    updateTopPlayer();
});

audioPlayer.addEventListener("ended", () => {
    updateIcons(localStorage.getItem("currentSongIndex"), false);
    localStorage.setItem("isPlaying", "false");
});

function updateTopPlayer() {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    const songTitle = songs[currentSongIndex]?.title || "Unknown Song";
    const songArtist = songs[currentSongIndex]?.artist || "Unknown Artist";

    document.getElementById("songTitle").textContent = songTitle;
    document.getElementById("artistName").textContent = songArtist;
}


document.querySelectorAll(".artist-card a").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const artistName = event.currentTarget.querySelector("p").textContent;
        openArtistModal(artistName);
    });
});

//////////// ALBUMS - WINDOW //////////////
const albums = {
    "The Eminem Show": {
        image: "/images/artists/eminem-album.jpeg",
        songs: [
            { name: "Without Me", artist: "Eminem", image: "/images/artists/eminem-album.jpeg", src: "/songs/Without Me (Sefon.Pro).mp3" },
            { name: "Sing For The Moment", artist: "Eminem", image: "/images/covers/sing-for-the-moment.jpeg", src: "/songs/Sing For The Moment (Sefon.Pro).mp3" },
            { name: "The Real Slim Shady", artist: "Eminem", image: "/images/artists/eminem-album.jpeg", src: "/songs/The Real Slim Shady (Sefon.me).mp3" },
            { name: "Smack That", artist: "Eminem", image: "/images/covers/smack-that.webp", src: "/songs/Eminem-ft.-Akon---Smack-That.mp3" },
            { name: "Not Afraid", artist: "Eminem", image: "/images/covers/eminem-notafraid.jpeg", src: "/songs/Eminem---No-Afraid.mp3" },
            { name: "Superman", artist: "Eminem", image: "/images/artists/eminem-album.jpeg", src: "/songs/Eminem - Superman.mp3" }, 
        ]
    },

    "Starboy": {
        image: "/images/artists/weeknd-album.jpeg",
        songs: [
            { name: "Starboy", artist: "The Weeknd", image: "/images/covers/weeknd-starboy.jpeg", src: "/songs/The Weeknd feat. Daft Punk - Starboy.mp3" },
            { name: "Reminder", artist: "The Weeknd", image: "/images/covers/reminder.jpeg", src: "/songs/Reminder (Sefon.me).mp3" },
            { name: "Die For You",artist: "The Weeknd", src: "/songs/The-Weeknd---Die-For-You-(feat.-Ariana-Grande).mp3",
            image: "/images/covers/dieforyou.jpeg"  },
            { name: "Stargirl Interlude", artist: "The Weeknd", image: "/images/covers/stargirl.png", src: "/songs/The Weeknd feat. Lana Del Rey - Stargirl (Interlude).mp3" },
            { name: "I Feel It Coming", artist: "The Weeknd", image: "/images/covers/ifeel.png", src: "/songs/The Weeknd - I Feel It Coming.mp3" },
            { name: "Six Feet Under", artist: "The Weeknd", image: "/images/covers/sixfeet.png", src: "/songs/The Weeknd - Six Feet Under.mp3" }
        ]
    },
        "Graduation": {
        image: "/images/artists/kanye-album.jpeg",
        songs: [
            { name: "Flashing Lights", artist: "Kanye West", image: "/images/artists/kanye-album.jpeg", src: "/songs/Flash Lights (Sefon.me).mp3" },
            { name: "Good Morning", artist: "Kanye West", image: "/images/artists/kanye-album.jpeg", src: "/songs/Kanye West - Good Morning.mp3" },
            { name: "Stronger", artist: "Kanye West", image: "/images/artists/kanye-album.jpeg", src: "/songs/Stronger (OST Мальчишник 2. Из Вегаса В Бангкок) (Sefon.me).mp3" },
            { name: "I Love It", artist: "Kanye West", image: "/images/covers/iloveit.jpeg", src: "/songs/Kanye West & Lil Pump - I Love It.mp3" },
            { name: "Praise God", artist: "Kanye West", image: "/images/covers/praise.jpeg", src: "/songs/Kanye West - Praise God.mp3" },
            { name: "Monster", artist: "Kanye West", image: "/images/covers/monster.jpeg", src: "/songs/Monster (Sefon.me).mp3" }
        ]
    },
            "Reload": {
        image: "/images/artists/jax album.jpeg",
        songs: [
            { name: "Эсиндеби", artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/эсиндеби.mp3" },
            { name: "БСББ", artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/бсбб.mp3" },
            { name: "Коюп Кой" , artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/коюп-кой.mp3" },
             { name: "Зая" , artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/зая.mp3" },
            { name: "Брудершафт" , artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/брудершафт.mp3" },
             { name: "Себелеп" , artist: "Jax (02.14)", image: "/images/artists/jax album.jpeg", src: "/songs/Jax (02.14) - Sebelep.mp3" },
        ]
    }
};

let currentAlbumAudio = null;
let currentAlbumPlayIcon = null;
const albumPlayIcons = new Map();

function openAlbumModal(albumName) {
    const modal = document.getElementById("albumModal");
    const modalContent = document.querySelector(".modal-album-content"); // Контейнер модального окна
    const albumImage = document.getElementById("albumImage");
    const albumTitle = document.getElementById("albumName");
    const albumSongs = document.getElementById("albumSongs");

    if (albums[albumName]) {
        albumTitle.textContent = albumName;
        albumImage.src = albums[albumName].image;
        albumSongs.innerHTML = "";
        albumPlayIcons.clear();

        albums[albumName].songs.forEach((song, index) => {
            const songItem = createAlbumSongItem(song, albumName, index);
            albumSongs.appendChild(songItem);
        });

        // Получаем div альбома, который был нажат
        const albumCard = [...document.querySelectorAll(".album-card")].find(card => 
            card.querySelector("p").textContent === albumName
        );

        if (albumCard) {
            const albumBg = getComputedStyle(albumCard).getPropertyValue("--album-bg");
            modalContent.style.setProperty("--album-bg", albumBg);
        }

        modal.style.display = "flex";
    }
}


function closeAlbumModal() {
    document.getElementById("albumModal").style.display = "none";
    if (currentAlbumAudio) {
        currentAlbumAudio.pause();
        currentAlbumAudio = null;
        localStorage.setItem("isPlaying", "false");
    }
}


function createAlbumSongItem(song, albumName, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("grid-item");

    songItem.innerHTML = `
        <img src="${song.image}" alt="Song Image" class="track-artist-image">
        <div class="item-info-cover">
            <div class="track-info track-name-history">${song.name}</div>
            <div class="track-info track-artist track-artist-history">${song.artist}</div>
        </div>
        <img src="/images/icons/play-white.png" alt="play-icon" class="play-icon">
    `;

    const playIcon = songItem.querySelector(".play-icon");
    albumPlayIcons.set(index, playIcon);

    playIcon.addEventListener("click", (event) => {
        event.stopPropagation(); 
        playSongFromAlbum(song, index);
    });

    return songItem;
}

function playSongFromAlbum(song, songIndex) {
    const currentSongSrc = localStorage.getItem("songSrc");

    // Найдём текущий альбом по песне
    let albumName = "Unknown Album";
    for (const [key, value] of Object.entries(albums)) {
        if (value.songs.includes(song)) {
            albumName = key;
            break;
        }
    }

    // Если песня уже играет, ставим на паузу
    if (currentSongSrc === song.src && !audioPlayer.paused) {
        audioPlayer.pause();
        updateAlbumIcons(songIndex, false);
        localStorage.setItem("isPlaying", "false");
        return;
    }

    // Устанавливаем новую песню в глобальном плеере
    audioPlayer.src = song.src;
    audioPlayer.play().then(() => {
        updateAlbumIcons(songIndex, true);
        localStorage.setItem("isPlaying", "true");
    }).catch(err => console.error("Error playing audio:", err));

    // Обновляем информацию в нижнем плеере
    document.getElementById("song-image").src = song.image;
    document.getElementById("song-name").textContent = song.name;
    document.getElementById("song-artist").textContent = song.artist;  // Выводим имя исполнителя

    // Сохраняем текущую песню в localStorage
    localStorage.setItem("currentSongIndex", songIndex);
    localStorage.setItem("songSrc", song.src);
    localStorage.setItem("songName", song.name);
    localStorage.setItem("songAlbum", albumName);
}


function updateAlbumIcons(currentSongIndex, isPlaying) {
    // Обновляем иконки в модальном окне альбома
    albumPlayIcons.forEach((icon, index) => {
        icon.src = index === currentSongIndex && isPlaying 
            ? "/images/icons/pause-white.png" 
            : "/images/icons/play-white.png";
    });

    // Обновляем иконку в нижнем плеере
    const bottomPlayIcon = document.getElementById("bottomPlayIcon");
    if (bottomPlayIcon) {
        bottomPlayIcon.src = isPlaying 
            ? "/images/icons/pause-white.png" 
            : "/images/icons/play-white.png";
    }
}

// События для обновления состояния плеера
audioPlayer.addEventListener("play", () => {
    updateAlbumIcons(localStorage.getItem("currentSongIndex"), true);
    localStorage.setItem("isPlaying", "true");
});

audioPlayer.addEventListener("pause", () => {
    updateAlbumIcons(localStorage.getItem("currentSongIndex"), false);
    localStorage.setItem("isPlaying", "false");
});

audioPlayer.addEventListener("ended", () => {
    updateAlbumIcons(localStorage.getItem("currentSongIndex"), false);
    localStorage.setItem("isPlaying", "false");
});

// Подключаем обработчики нажатий для альбомов
document.querySelectorAll(".album-card a").forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const albumName = event.currentTarget.querySelector("p").textContent;
        openAlbumModal(albumName);
    });
});

/////////////  MOOD

document.addEventListener("DOMContentLoaded", function () {
  const moodModal = document.getElementById("moodModal");
  const closeModalBtn = document.querySelector("#moodModal .close");
  const moodTitle = document.getElementById("mood-it");
  const songContainer = document.getElementById("selectedSongs");

  if (moodModal) {
    moodModal.style.display = "none";
  } else {
    console.error("Элемент с id 'moodModal' не найден");
  }

  const moods = {
      "sad-mood": {
          name: "Грустное",
          image: "/images/covers/sad-cover.png",
          songs: [
              { title: "Homesick", artist: "The Cure", image: "/images/covers/mood/cure.png", src: "/songs/sad/The Cure - Homesick.mp3" },
              { title: "Liquid Smooth", artist: "Mitski", image: "/images/covers/mood/Mitski.png", src: "/songs/sad/Mitski-Liquid Smooth.mp3" },
              { title: "Будь моим смыслом", artist: "Fleur", image: "/images/covers/mood/Fleur.png", src: "/songs/sad/Flëur - Будь моим смыслом.mp3" },
              { title: "Тени", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/sad/Валентин Стрыкало - Тени.mp3" },
              { title: "В темноте", artist: "Noize MC", image: "/images/covers/charts/noize mc - nocomments.png", src: "/songs/sad/Noize MC - В темноте.mp3" },
              { title: "Дешевые драмы", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/sad/Валентин Стрыкало-Дешёвые драмы.mp3" }
          ]
      },
      "happy-mood": {
          name: "Веселое",
          image: "/images/covers/happy-cover.png",
          songs: [
              { title: "Кайен", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/happy/Валентин Стрыкало - Кайен.mp3" },
              { title: "Фанк", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/happy/Валентин Стрыкало-Фанк.mp3" },
              { title: "Офисный стиляга", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/happy/Валентин Стрыкало - Офисный Стиляга.mp3" },
              { title: "Душнила", artist: "idst", image: "/images/covers/charts/idst - Душнила.png", src: "/songs/happy/idst - Душнила.mp3" },
              { title: "По небу", artist: "W.K.", image: "/images/covers/mood/по небу.png", src: "/songs/happy/По небу - W.K..mp3" },
              { title: "Gimme Chocolate!", artist: "Babymetal", image: "/images/covers/mood/Babymetal.png", src: "/songs/happy/Gimme Chocolate!! - Babymetal.mp3" }
          ]
      },
      "calm-mood": {
          name: "Спокойное",
          image: "/images/covers/calm-cover.png",
          songs: [
              { title: "Шанс", artist: "Дайте танк (!)", image: "/images/covers/mood/танк.png", src: "/songs/calm/Шанс - Дайте танк (!).mp3" },
              { title: "Декабрь", artist: "войка, Миролюбивое Море", image: "/images/covers/mood/декабрь.png", src: "/songs/calm/Декабрь - войка, Миролюбивое Море.mp3" },
              { title: "До восхода", artist: "Ручной рептилоид", image: "/images/covers/mood/рептилоид.png", src: "/songs/calm/До восхода - Ручной Рептилоид.mp3" },
              { title: "Весна", artist: "Гр. Полухутенко", image: "/images/covers/mood/полухутенко.png", src: "/songs/calm/Весна - Гр. Полухутенко.mp3" },
              { title: "Pain", artist: "PinkPantheress", image: "/images/covers/mood/pain.png", src: "/songs/calm/Pain - PinkPantheress.mp3" },
              { title: "Бесполезно", artist: "Валентин Стрыкало", image: "/images/covers/mood/валентин.png", src: "/songs/calm/Валентин Стрыкало - Бесполезно.mp3" }
          ]
      }
  };

  
let currentPlaylist = null;

function resetMoodAndPlayerIcons() {
  const moodIcons = document.querySelectorAll(".custom-play-icon");
  moodIcons.forEach(icon => {
    icon.src = "/images/icons/play-white.png";
  });
  const playerIcon = document.querySelector("#play-btn img");
  if (playerIcon) {
    playerIcon.src = "/images/icons/play-white.png";
  }
}

function openMoodModal(moodKey) {
  const mood = moods[moodKey];
  if (!mood) return;

  if (currentPlaylist !== moodKey) {
    const audioPlayer = document.getElementById("audio-player");
    if (audioPlayer && !audioPlayer.paused) {
      audioPlayer.pause();
    }
    resetMoodAndPlayerIcons();
    localStorage.setItem("isPlaying", "false");
    localStorage.removeItem("currentSongIndex");
    localStorage.removeItem("songSrc");
    currentPlaylist = moodKey;
  }

  // Меняем фон контента модального окна
  const modalContent = document.querySelector(".modal-mood-content");
  modalContent.classList.remove("sad", "happy", "calm");

  if (moodKey === "sad-mood") {
    modalContent.classList.add("sad");
  } else if (moodKey === "happy-mood") {
    modalContent.classList.add("happy");
  } else if (moodKey === "calm-mood") {
    modalContent.classList.add("calm");
  }

  moodTitle.textContent = mood.name;
  moodTitle.style.backgroundImage = `url(${mood.image})`;
  moodTitle.style.backgroundSize = "cover";
  moodTitle.style.backgroundPosition = "center";
  loadPopularSongs(mood.songs);
  moodModal.style.display = "flex";
}



function closeMoodModal() {
  moodModal.style.display = "none";
}

document.querySelectorAll(".mood-item").forEach(item => {
  item.addEventListener("click", function () {
    openMoodModal(this.id);
    localStorage.setItem("moodModalDisplayed", "true");
  });
});

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeMoodModal);
}

window.addEventListener("click", function (event) {
  if (event.target === moodModal) {
    closeMoodModal();
  }
});

const audioPlayer = document.getElementById('audio-player');
if (audioPlayer) {
  audioPlayer.addEventListener("pause", () => {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    updateMoodIcons(Number(currentSongIndex), false);
    updatePlayIcon(false);
    localStorage.setItem("isPlaying", "false");
  });

  audioPlayer.addEventListener("ended", () => {
    const currentSongIndex = localStorage.getItem("currentSongIndex");
    updateMoodIcons(Number(currentSongIndex), false);
    updatePlayIcon(false);
    localStorage.setItem("isPlaying", "false");
  });
}

function loadPopularSongs(songs) {
  songContainer.innerHTML = "";
  const currentSongIndex = localStorage.getItem("currentSongIndex");
  const isPlaying = localStorage.getItem("isPlaying") === "true";

  songs.forEach((song, index) => {
    const songElement = document.createElement("div");
    songElement.classList.add("custom-grid-artist-item");
    songElement.innerHTML = `
      <img class="custom-track-artist-image" src="${song.image}" alt="${song.title}">
      <div class="custom-item-info-cover">
        <div class="custom-track-info">${song.title}</div>
        <div class="custom-track-artist">${song.artist}</div>
      </div>
      <img class="custom-play-icon" src="/images/icons/play-white.png" alt="Play">
    `;
    songContainer.appendChild(songElement);

    const playIcon = songElement.querySelector(".custom-play-icon");

    if (index == currentSongIndex && isPlaying) {
      playIcon.src = "/images/icons/pause-white.png";
    }

    playIcon.addEventListener("click", () => {
      playSongFromMood(song, index);
    });
  });
}

function playSongFromMood(song, songIndex) {
  const songImage = document.querySelector("#song-image");
  const songTitle = document.querySelector("#song-name");
  const songArtist = document.querySelector("#song-artist");
  const audioPlayer = document.getElementById('audio-player');

  const currentSongSrc = localStorage.getItem("songSrc");

  if (currentSongSrc === song.src && !audioPlayer.paused) {
    audioPlayer.pause();
    updateMoodIcons(songIndex, false);
    localStorage.setItem("isPlaying", "false");
    return;
  }

  songImage.src = song.image;
  songImage.alt = song.title;
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audioPlayer.src = song.src;

  audioPlayer.play().then(() => {
    updateMoodIcons(songIndex, true);
    localStorage.setItem("isPlaying", "true");
  });

  localStorage.setItem("currentSongIndex", songIndex);
  localStorage.setItem("songSrc", song.src);
  updatePlayIcon(true);
}

function updateMoodIcons(currentSongIndex, isPlaying) {
  const songElements = document.querySelectorAll(".custom-grid-artist-item");
  songElements.forEach((songElement, index) => {
    const playIcon = songElement.querySelector(".custom-play-icon");
    playIcon.src = (index === currentSongIndex && isPlaying)
      ? "/images/icons/pause-white.png"
      : "/images/icons/play-white.png";
  });
  updatePlayIcon(isPlaying);
}

function updatePlayIcon(isPlaying) {
  const playIcon = document.querySelector("#play-btn img");
  if (playIcon) {
    playIcon.src = isPlaying ? "/images/icons/pause-white.png" : "/images/icons/play-white.png";
  }
}

function setMood(moodKey) {
  const selectedMood = moods[moodKey];
  shuffledPlaylist = selectedMood.songs;
  currentSongIndex = 0;
  updateSongInfo();
}

});

