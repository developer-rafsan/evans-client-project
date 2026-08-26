const phoneSideMenu = document.getElementById("phoneSideMenu");
const menuIcon = document.querySelector(".menuIcon");
const closeIcon = document.querySelector(".closeIcon");
const slider = document.querySelector('.items');
const originalItems = [...slider.children];

// Change speed slider here 
let position = 0;
const speed = 1;

// ===============================
// open phone menu function
// ===============================
function openPhoneMenu() {
    phoneSideMenu.classList.add("active");
}

// ===============================
// close phone menu function
// ===============================
function closePhoneMenu() {
    phoneSideMenu.classList.remove("active");
}

// ==========================================
// Clone items for seamless infinite loop
// ==========================================
originalItems.forEach(item => {
    slider.appendChild(item.cloneNode(true));
});

// ==========================================
// infinite loop slider function
// ==========================================
function animateSlider() {
    position -= speed;

    const firstItem = slider.children[0];
    const gap = parseFloat(getComputedStyle(slider).gap);

    const itemWidth = firstItem.offsetWidth + gap;

    // Reset when the original set has completely passed
    if (Math.abs(position) >= itemWidth * originalItems.length) {
        position = 0;
    }

    slider.style.transform = `translate3d(${position}px, 0, 0)`;

    requestAnimationFrame(animateSlider);
}

// ===============================
// all function all here
// ===============================
menuIcon.addEventListener("click", openPhoneMenu);
closeIcon.addEventListener("click", closePhoneMenu);
document.querySelectorAll(".phoneSideMenu ul li a").forEach((link) => {
    link.addEventListener("click", closePhoneMenu);
});
animateSlider();