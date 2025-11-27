// -----------------------------------------------------
//  Atlas Friend Finder Frontend Script
// -----------------------------------------------------

const API_URL = "https://atlas-production-8939.up.railway.app";

console.log("script.js loaded");

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

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3.5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(3, 2, 5);
    scene.add(mainLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // Globe Geometry
    const geometry = new THREE.SphereGeometry(1.3, 64, 64);

    // Texture
    const texture = new THREE.TextureLoader().load("assets/cartoon_earth.png");

    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    // Create Earth
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    animate();
}

// Animation loop
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
// INIT — runs on every page
// -----------------------------------------------------
window.addEventListener("load", () => {
    // Only run Globe if we're on distance.html
    if (window.location.pathname.includes("distance.html")) {
        initGlobe();
    }
});
