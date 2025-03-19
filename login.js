document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("errorMessage");
    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", async () => {
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!username || !password) {
            errorMessage.textContent = "Заполните все поля!";
            errorMessage.style.display = "block";
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
                localStorage.setItem("username", data.username);
                closeModal();
                alert("Добро пожаловать, " + data.username + "!");
                location.reload(); // Обновляем страницу для загрузки данных пользователя
            } else {
                errorMessage.textContent = data.error || "Ошибка входа";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
            errorMessage.textContent = "Нет соединения с сервером";
            errorMessage.style.display = "block";
        }
    });
});