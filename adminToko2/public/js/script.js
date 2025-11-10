// Toggle sidebar on small screens
const btn = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");

// Cek kalau tombol dan sidebar ada
if (btn && sidebar) {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
    });
}

// Dropdown user (pojok kanan atas)
const userButton = document.getElementById("userMenuButton");
const userMenu = document.getElementById("userMenu");

if (userButton && userMenu) {
    userButton.addEventListener("click", () => {
        userMenu.classList.toggle("hidden");
    });
    // Klik di luar menu → tutup menu
    document.addEventListener("click", function (e) {
        if (!userButton.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add("hidden");
        }
    });
}
