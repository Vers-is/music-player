document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("errorMessage");

    // Функция для открытия модального окна входа
    function showLoginModal() {
        const loginModal = document.getElementById("loginModal");
        loginModal.style.display = "block";  // Показываем модальное окно
    }

    // Функция для закрытия модального окна
    function closeModal() {
        const loginModal = document.getElementById("loginModal");
        loginModal.style.display = "none";  // Скрываем модальное окно
    }

    // Добавление обработчика для закрытия модального окна
    document.querySelector(".close-user").addEventListener("click", closeModal);

    function updateProfileIcon(username) {
        const profileIcon = document.getElementById("profileIcon");
        const avatars = JSON.parse(localStorage.getItem("avatars")) || {
            "default": "/images/default-avatar.png"
        };
        const avatarSrc = avatars[username] || avatars["default"];

        profileIcon.style.backgroundImage = `url(${avatarSrc})`;
        profileIcon.style.backgroundSize = "cover";
        profileIcon.style.backgroundPosition = "center";
        profileIcon.style.backgroundRepeat = "no-repeat";
    }

    function updateProfileName(username) {
        const profileName = document.getElementById("profileName");
        profileName.textContent = username || "Гость";
    }

    // Код для обработки регистрации
    document.getElementById("create")?.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            errorMessage.textContent = "Заполните все поля!";
            errorMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("loggedInUser", username);
                alert("Регистрация успешна!");
                updateProfileIcon(username);
                updateProfileName(username);
                window.location.href = "player.html";
            } else {
                errorMessage.textContent = data.error || "Ошибка регистрации";
                errorMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            errorMessage.textContent = "Нет соединения с сервером";
            errorMessage.style.color = "red";
        }
    });

    // Код для обработки входа
    document.getElementById("login-button")?.addEventListener("click", async () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            errorMessage.textContent = "Заполните все поля!";
            errorMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("loggedInUser", username);
                alert("Вход успешен!");
                updateProfileIcon(username);
                updateProfileName(username);
                window.location.href = "player.html";
            } else {
                errorMessage.textContent = data.error || "Ошибка входа";
                errorMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
            errorMessage.textContent = "Нет соединения с сервером";
            errorMessage.style.color = "red";
        }
    });

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        updateProfileIcon(loggedInUser);
        updateProfileName(loggedInUser);
    }
});
