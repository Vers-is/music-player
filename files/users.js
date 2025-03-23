document.addEventListener("DOMContentLoaded", async () => {
    // Проверяем, авторизован ли пользователь
    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {
        // Если пользователь авторизован, загружаем его данные
        await loadUserData(savedUsername);
    } else {
        // Если нет, показываем гостевой интерфейс
        updateProfileUI(null);
    }
});
function openLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "flex"; // Или "block", в зависимости от ваших стилей
}

document.getElementById("profileIcon").addEventListener("click", () => {
    const menu = document.getElementById("profileMenu");
    if (localStorage.getItem("username")) {
        // Если пользователь авторизован, показываем меню
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    } else {
        // Если нет, открываем модальное окно входа
        openLoginModal(); // Убедитесь, что эта строка есть
    }
});
function closeModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
    document.getElementById("username").value = ""; // Очищаем поле логина
    document.getElementById("password").value = ""; // Очищаем поле пароля
    document.getElementById("errorMessage").style.display = "none"; // Скрываем сообщение об ошибке
}

// Функция для загрузки данных пользователя
async function loadUserData(username) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/users/${username}`);
        const data = await response.json();

        if (response.ok) {
            updateProfileUI(data); // Обновляем интерфейс
        } else {
            console.error("Ошибка при получении пользователя:", data.error);
            updateProfileUI(null);
        }
    } catch (error) {
        console.error("Ошибка:", error);
        updateProfileUI(null);
    }
}

// Функция для обновления UI профиля
function updateProfileUI(user) {
    const profileName = document.getElementById("profileName");
    const avatarElement = document.getElementById("avatarIcon");

    if (user?.username) {
        profileName.textContent = user.username;
        avatarElement.src = user.avatar || "/images/default.jpg";
    } else {
        profileName.textContent = "Гость";
        avatarElement.src = "/images/default.jpg";
    }
}

// Закрытие меню при клике вне него
window.addEventListener("click", (e) => {
    const menu = document.getElementById("profileMenu");
    if (!e.target.closest("#profileIcon") && !e.target.closest("#profileMenu")) {
        menu.style.display = "none";
    }
});

// Выход из аккаунта
async function logout() {
    if (confirm("Вы точно хотите выйти из аккаунта?")) {
        try {
            const response = await fetch('http://127.0.0.1:3000/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem("username");
                updateProfileUI(null);
                alert("Вы вышли из аккаунта.");
                location.reload();
            } else {
                throw new Error('Ошибка при выходе из системы');
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            alert('Не удалось выйти из аккаунта: ' + error.message);
        }
    }
}

// Обработчик для загрузки нового аватара
const changeAvatarInput = document.getElementById('changeAvatar');
changeAvatarInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('http://127.0.0.1:3000/api/users/updateAvatar', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Важно: передаем cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка при загрузке аватара');
        }

        console.log('Аватар успешно обновлен:', data.avatar);

        // Обновляем аватар в интерфейсе
        const avatarIcon = document.getElementById('avatarIcon');
        avatarIcon.src = data.avatar;

        // Обновляем данные пользователя
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            await loadUserData(savedUsername);
        }
    } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        alert('Не удалось загрузить аватар: ' + error.message);
    }
});

// Функция для входа
async function checkLogin() {
    const username = document.getElementById("username").value; // Используем правильный ID
    const password = document.getElementById("password").value; // Используем правильный ID
    const errorMessage = document.getElementById("errorMessage");

    if (!username || !password) {
        errorMessage.textContent = "Заполните все поля!";
        errorMessage.style.display = "block";
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Передаем cookies
            body: JSON.stringify({ username, password }) // Отправляем данные для входа
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("username", username); // Сохраняем имя пользователя
            updateProfileUI({ username, avatar: data.avatar }); // Обновляем интерфейс
            closeModal(); // Закрываем модальное окно
        } else {
            errorMessage.textContent = data.error || "Ошибка входа";
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Детали ошибки:", error);
        errorMessage.textContent = "Ошибка соединения с сервером";
        errorMessage.style.display = "block";
    }
}