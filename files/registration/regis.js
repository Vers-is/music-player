// function getUsers() {
//     return JSON.parse(localStorage.getItem("users")) || {};
// }

// function saveUsers(users) {
//     localStorage.setItem("users", JSON.stringify(users));
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const regisButton = document.getElementById("regis-button");

//     regisButton.addEventListener("click", () => {
//         const username = document.getElementById("reg-username").value.trim();
//         const password = document.getElementById("reg-password").value.trim();

//         if (!username || !password) {
//             alert("Пожалуйста, введите логин и пароль.");
//             return;
//         }

//         let users = getUsers();

//         if (users[username]) {
//             alert("Пользователь с таким логином уже существует.");
//             return;
//         }

//         users[username] = password;
//         saveUsers(users);

//         alert("Вы успешно зарегистрированы!");

//         localStorage.setItem("loggedInUser", username);

//         window.location.href = "../index.html";
//     });
// });

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

        try {
            const response = await fetch("http://127.0.0.1:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

          if (response.ok) {
                // Сохраняем имя пользователя в localStorage
                localStorage.setItem("username", username);
                alert("Регистрация успешна!");
                window.location.href = "../index.html"; // Перенаправляем на главную страницу
            }
            else {
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

