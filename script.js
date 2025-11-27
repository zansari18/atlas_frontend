// -----------------------------------------------------
//  Cute 3D Cartoon Earth Globe for Atlas Friend Finder
// -----------------------------------------------------

let scene, camera, renderer, earth;

function initGlobe() {
    const container = document.getElementById("globeContainer");

    // --- Scene ---
    scene = new THREE.Scene();
    
    // --- Camera ---
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3.5;

    // --- Renderer ---
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(3, 2, 5);
    scene.add(mainLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // --- Globe Geometry ---
    const geometry = new THREE.SphereGeometry(1.3, 64, 64);

    // --- Cartoon Earth Texture ---
    const texture = new THREE.TextureLoader().load("assets/cartoon_earth.png");

    // Smooth material with cute pastel lighting
    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    // --- Create Earth ---
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // --- Start Animating ---
    animate();
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Gentle, cute rotation
    earth.rotation.y += 0.002;  

    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener("load", initGlobe);
