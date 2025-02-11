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

const users = {
    "eldana": "220906",
    "vers": "12345"
};

function openModal() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("username").value = ""; 
    document.getElementById("password").value = ""; 
    document.getElementById("errorMessage").style.display = "none"; 
}

function checkLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
        alert("Добро пожаловать, " + username + "!");
        closeModal();
    } else {
        document.getElementById("errorMessage").style.display = "block";
    }
}
