document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("errorMessage");
    const registerButton = document.getElementById("regis-button");

    registerButton.addEventListener("click", async () => {
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        if (!username || !password) {
            errorMessage.textContent = "Заполните все поля!";
            errorMessage.style.display = "block";
            return;
        }

        if (password.length < 8) {  // ✅ Проверка длины пароля
            errorMessage.textContent = "Пароль должен содержать минимум 8 символов!";
            errorMessage.style.display = "block";
            return;
        }

        try {
const response = await fetch("http://127.0.0.1:3000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
});


            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("username", username);
                alert("Регистрация успешна!");
                window.location.href = "../index.html";
            } else {
                errorMessage.textContent = data.error || "Ошибка регистрации";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            errorMessage.textContent = "Нет соединения с сервером";
            errorMessage.style.display = "block";
        }
    });
});