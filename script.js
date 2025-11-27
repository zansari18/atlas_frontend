// -----------------------------------------------------
//  Atlas Friend Finder Frontend Script
// -----------------------------------------------------

const API_URL = "https://atlas-production-8939.up.railway.app";

console.log("script.js loaded");

let currentUser = null;

async function loadUserName() {
    try {
        const res = await fetch(`${API_URL}/me`, {
            credentials: "include"
        });

        if (!res.ok) return;

        const data = await res.json();
        currentUser = data.username;
    } catch (err) {
        console.error("Could not load username:", err);
    }
}

// -----------------------------------------------------
// LOGIN FUNCTION
// -----------------------------------------------------
async function login() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
        window.location.href = "distance.html";
    } else {
        alert(data.error || "Login failed");
    }
}

// -----------------------------------------------------
// LOCATION + DISTANCE
// -----------------------------------------------------

async function updateMyLocation() {
    if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        await fetch(`${API_URL}/updateLocation`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: lat, longitude: lon })
        });
    });
}

async function getDistance() {

    // Load username the FIRST time distance runs
    if (!currentUser) {
        await loadUserName();
    }

    const res = await fetch(`${API_URL}/distance`, {
        credentials: "include"
    });

    const data = await res.json();
    const label = document.getElementById("distanceLabel");

    if (!res.ok || data.milesApart === null) {
        label.innerText = "Waiting for both locations...";
        return;
    }

    // Fallback if username somehow fails to load
    if (!currentUser) {
        label.innerText = `${data.milesApart} miles apart`;
        return;
    }

    // The final pretty version:
    label.innerText = `${currentUser} is ${data.milesApart} miles apart from her bestie <3`;
}

function startDistanceUpdates() {
    updateMyLocation();
    getDistance();
    setInterval(() => {
        updateMyLocation();
        getDistance();
    }, 5000);
}

// -----------------------------------------------------
// 3D GLOBE CODE (ONLY RUNS ON DISTANCE PAGE)
// -----------------------------------------------------

let scene, camera, renderer, earth;

function initGlobe() {
    console.log("Initializing globe...");

    const container = document.getElementById("globeContainer");
    if (!container) {
        console.log("No globe container — skipping globe init.");
        return;
    }

    if (typeof THREE === "undefined") {
        console.error("THREE.js not loaded!");
        return;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3.5;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(3, 2, 5);
    scene.add(mainLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const geometry = new THREE.SphereGeometry(1.3, 64, 64);
    const texture = new THREE.TextureLoader().load("assets/cartoon_earth.png");

    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (earth) {
        earth.rotation.y += 0.002;
    }

    if (renderer && camera) {
        renderer.render(scene, camera);
    }
}

// -----------------------------------------------------
// PAGE INIT
// -----------------------------------------------------
window.addEventListener("load", () => {
    if (window.location.pathname.includes("distance.html")) {
        initGlobe();
        startDistanceUpdates();
    }
});
