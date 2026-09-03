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


// ============================================
// Service Accordance
// ============================================
function serviceAccordance() {
    const items = document.querySelectorAll(".serviceAccordance .item");

    items[0].classList.add("active");

    items.forEach((item) => {
        const header = item.querySelector(".header");
        header.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            items.forEach((i) => i.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}


// ============================================
// Why Sentry Section Slider
// ============================================
function whySentrysliderAnimation() {

    const sliderContainer = document.querySelector(".why_sentry .sliderContainer");

    if (!sliderContainer || typeof Swiper === "undefined") {
        return;
    }

    new Swiper(sliderContainer, {
        loop: true,
        speed: 700,
        spaceBetween: 20,
        grabCursor: true,

        slidesPerView: "auto",

        navigation: {
            prevEl: ".whySentryPrev",
            nextEl: ".whySentryNext",
        },
    });
}

// ============================================
// Reviews Section Slider
// ============================================
function reviewsSliderAnimation() {
    const reviewSlider = document.querySelector(".reviewSlider");

    if (!reviewSlider || typeof Swiper === "undefined") {
        return;
    }

    new Swiper(reviewSlider, {
        loop: true,
        speed: 700,
        spaceBetween: 16,
        grabCursor: true,

        slidesPerView: "auto",

        navigation: {
            prevEl: ".whySentryPrev",
            nextEl: ".whySentryNext",
        },
    });
}

// ============================================
// Service Areas Map
// ============================================
function serviceAreasMap() {
    const mapElement = document.getElementById("serviceAreasMap");
    const mapSelection = document.getElementById("mapSelection");
    const locationItems = document.querySelectorAll(".serviceAreaList [data-location]");

    if (!mapElement || !locationItems.length || typeof L === "undefined") {
        return;
    }

    const locationCoordinates = {
        "Bloomingburg, NY": [41.5571, -74.4360],
        "Wurtsboro, NY": [41.5751, -74.4871],
        "Fair Oaks, NY": [41.5640, -74.5200],
        "Rock Hill, NY": [41.6258, -74.5965],
    };

    const map = L.map(mapElement, {
        scrollWheelZoom: false,
    }).setView([41.59, -74.51], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const markerLayer = L.featureGroup().addTo(map);
    const markers = new Map();

    function createPinIcon(isActive = false) {
        return L.divIcon({
            className: "serviceAreaPinWrapper",
            html: `<span class="serviceAreaPin${isActive ? " active" : ""}" aria-hidden="true"></span>`,
            iconSize: [26, 36],
            iconAnchor: [13, 36],
            popupAnchor: [0, -34],
        });
    }

    function selectLocation(item, shouldMoveMap = true) {
        // data-location is the source of truth for the selected location.
        const location = item.dataset.location?.trim();
        const coordinates = locationCoordinates[location];

        if (!location || !coordinates) {
            return;
        }

        locationItems.forEach((locationItem) => {
            const isSelected = locationItem === item;
            locationItem.classList.toggle("active", isSelected);
            locationItem.setAttribute("aria-pressed", String(isSelected));
        });

        markers.forEach((marker, markerLocation) => {
            marker.setIcon(createPinIcon(markerLocation === location));
        });

        if (shouldMoveMap) {
            map.flyTo(coordinates, 13, { duration: 0.8 });
            markers.get(location)?.openPopup();
        }

        if (mapSelection) {
            mapSelection.textContent = `Showing ${location} on the map.`;
        }
    }

    locationItems.forEach((item) => {
        const location = item.dataset.location?.trim();
        const coordinates = locationCoordinates[location];

        if (!location || !coordinates) {
            return;
        }

        const marker = L.marker(coordinates, {
            icon: createPinIcon(),
            title: location,
            alt: location,
        }).bindPopup(`<strong>${location}</strong>`);

        marker.on("click", () => selectLocation(item));
        marker.addTo(markerLayer);
        markers.set(location, marker);

        item.addEventListener("click", () => selectLocation(item));
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectLocation(item);
            }
        });
    });

    if (markers.size) {
        map.fitBounds(markerLayer.getBounds().pad(0.2));

        // Keep the first location selected on initial load while showing all pins.
        const firstLocationItem = [...locationItems].find((item) => markers.has(item.dataset.location?.trim()));
        if (firstLocationItem) {
            selectLocation(firstLocationItem, false);
        }
    }
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
serviceAccordance();
whySentrysliderAnimation();
reviewsSliderAnimation();
serviceAreasMap();
