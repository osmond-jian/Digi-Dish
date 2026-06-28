const hamburger = document.getElementById("hamburger");
const navList = document.getElementById("navList");

hamburger.addEventListener("click", () => {
    navList.classList.toggle("show");
});

const links = document.querySelectorAll(".nav-list a");

links.forEach(link => {
    link.addEventListener("click", () => {
        navList.classList.remove("show");
    });
});