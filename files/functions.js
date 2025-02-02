///////////////// WINDOW -- CREATE PLAYLIST //////////////////

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const openModal = document.getElementById("create-playlist");
    const closeModal = document.getElementById("closeModal");


    openModal.addEventListener("click", () => {
        modal.style.display = "flex"; 
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none"; 
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

///////////////// //////////////// //////////////////
