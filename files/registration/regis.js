function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener("DOMContentLoaded", () => {
    const regisButton = document.getElementById("regis-button");

    regisButton.addEventListener("click", () => {
        const username = document.getElementById("reg-username").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        if (!username || !password) {
            alert("Пожалуйста, введите логин и пароль.");
            return;
        }

        let users = getUsers();

        if (users[username]) {
            alert("Пользователь с таким логином уже существует.");
            return;
        }

        users[username] = password;
        saveUsers(users);

        alert("Вы успешно зарегистрированы!");

        localStorage.setItem("loggedInUser", username);

        window.location.href = "../index.html";
    });
});
