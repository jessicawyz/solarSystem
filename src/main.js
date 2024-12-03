import * as THREE from 'three'; // Three.js core
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Camera controls

// Shared Variables
let scene, camera, renderer, controls;
let sun, earth, moon, jupiter, mars, venus, mercury, saturn, neptube;
let angleEarth = 0, angleMoon = 0, angleJupiter = 0, angleMars = 0, angleVenus = 0, angleMercury = 0, angleSaturn = 0, angleNeptune = 0;
let earthGroup, moonGroup, jupiterGroup, marsGroup, venusGroup, mercuryGroup, saturnGroup, neptuneGroup;
let earthOrbitLine, moonOrbitLine, jupiterOrbitLine, marsOrbitLine, venusOrbitLine, mercuryOrbitLine, saturnOrbitLine, neptuneOrbitLine;
let showOrbits = true; 
let animationRunning = true;

// Initialize Scene
document.addEventListener("DOMContentLoaded", () => {
    init();
    animate();
});

window.addEventListener("keydown", (event) => {
    const movementSpeed = 1; // Adjust movement speed

    switch (event.key) {
        case "w": // Move forward
            camera.position.z -= movementSpeed;
            break;
        case "s": // Move backward
            camera.position.z += movementSpeed;
            break;
        case "a": // Move left
            camera.position.x -= movementSpeed;
            break;
        case "d": // Move right
            camera.position.x += movementSpeed;
            break;
        case "ArrowUp": // Move up
            camera.position.y += movementSpeed;
            break;
        case "ArrowDown": // Move down
            camera.position.y -= movementSpeed;
            break;
        case "r": // Reset camera position
            camera.position.set(0, 0, 50);
            camera.rotation.set(0, 0, 0);
            break;
        case "e": // Toggle animation on/off
            animationRunning = !animationRunning;
            if (animationRunning) {
                animate(); // Start animation
            }
            break;
    }
    controls.update();

});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



function init() {

    // Create Renderer
    const canvas = document.getElementById("webglCanvas");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Scene
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 50);

    // Add Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.enablePan = true;

    // Handle window resizing
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Add background into scene
    const loader = new THREE.TextureLoader();
    const backgroundTexture = loader.load('./textures/stars.jpg');
    scene.background = backgroundTexture;

    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    // Point Light Mimics sunlight's effect
    const pointLight = new THREE.PointLight(0xffffff, 20, 200, 0.5);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(ambientLight, pointLight);

    // Load Textures
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("./textures/sun2.jpeg");
    const earthTexture = textureLoader.load("./textures/earth2.jpeg");
    const moonTexture = textureLoader.load("./textures/moon2.jpeg");
    const jupiterTexture = textureLoader.load("./textures/jupiter.jpg");
    const marsTexture = textureLoader.load("./textures/mars.jpg");
    const venusTexture = textureLoader.load("./textures/venus.jpg");
    const mercuryTexture = textureLoader.load("./textures/mercury.jpg");
    const saturnTexture = textureLoader.load("./textures/saturn.jpg");
    const saturnRingTexture = textureLoader.load("./textures/saturn_ring.png");

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        emissive: 0xffffaa, // Add a warm glow
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Earth and its Moon
    earthGroup = new THREE.Object3D();
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ 
        map: earthTexture,
        /*specular: 0xffffff,   
        shininess: 10   */ 
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    earth.rotation.z = THREE.MathUtils.degToRad(23.5);

    // Simulation of atmosphere around earth
    const atmosphereGeometry = new THREE.SphereGeometry(1.3, 32, 32); // Slightly larger then earth
    const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEFA, transparent: true, opacity: 0.5 });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere); 


    moonGroup = new THREE.Object3D();
    earthGroup.add(moonGroup);

    const moonGeometry = new THREE.SphereGeometry(0.4, 32, 32); // Moon is about 1:10 ratio to Earth, but it would be too small
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);

    moonGroup.add(moon);

    // Jupiter
    jupiterGroup = new THREE.Object3D();
    scene.add(jupiterGroup);

    const jupiterGeometry = new THREE.SphereGeometry(4, 32, 32); // Jupiter is 11: 1 to Earth, but it will be too big for simulation
    const jupiterMaterial = new THREE.MeshPhongMaterial({ map: jupiterTexture });
    jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiterGroup.add(jupiter);
    jupiter.rotation.x = THREE.MathUtils.degToRad(3); 

    // Mars
    marsGroup = new THREE.Object3D();
    scene.add(marsGroup);

    const marsGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Mars is 0.5 : 1 to Earth
    const marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture });
    mars = new THREE.Mesh(marsGeometry, marsMaterial);
    marsGroup.add(mars);

    // Venus
    venusGroup = new THREE.Object3D();
    scene.add(venusGroup);

    const venusGeometry = new THREE.SphereGeometry(0.95, 32, 32); // 0.95 : 1
    const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });
    venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venusGroup.add(venus);

    // Mercury
    mercuryGroup = new THREE.Object3D();
    scene.add(mercuryGroup);

    const mercuryGeometry = new THREE.SphereGeometry(0.33, 32, 32); // 0.33 : 1
    const mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture });
    mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercuryGroup.add(mercury);

    // Saturn
    saturnGroup = new THREE.Object3D();
    scene.add(saturnGroup);

    const saturnGeometry = new THREE.SphereGeometry(3, 32, 32);
    const saturnMaterial = new THREE.MeshPhongMaterial({ map: saturnTexture });
    saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    saturnGroup.add(saturn);
    saturn.rotation.x = THREE.MathUtils.degToRad(26.7);

    // Saturn Ring
    const saturnRingGeometry = new THREE.RingGeometry(3.5, 5, 64); // Inner radius, outer radius, number of segments
    const saturnRingMaterial = new THREE.MeshBasicMaterial({
        map: saturnRingTexture,  
        side: THREE.DoubleSide,  // both sides visible
        opacity: 0.8 
    });

    // Add it to the Saturn group
    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRing.rotation.x = Math.PI / 2;  // Rotate to be horizontal
    saturnGroup.add(saturnRing);  
    saturnRing.position.set(0, 0, 0); 


    // Orbit Lines
    // Semi Major and Semi Minor axis (not realisticlly modelled)
    earthOrbitLine = createOrbitLine(15, 10, 64);  // Earth orbit (ellipse)
    moonOrbitLine = createOrbitLine(3, 2, 32);     // Moon orbit (ellipse around Earth)
    jupiterOrbitLine = createOrbitLine(25, 20, 64); // Jupiter orbit (ellipse)
    marsOrbitLine = createOrbitLine(20, 15, 64);    // Mars orbit (ellipse)
    venusOrbitLine = createOrbitLine(10, 8, 64);    // Venus orbit (ellipse)
    mercuryOrbitLine = createOrbitLine(7, 6, 64);   // Mercury orbit (ellipse)
    saturnOrbitLine = createOrbitLine(30, 25, 64);  // Saturn orbit (ellipse)


    scene.add(earthOrbitLine, jupiterOrbitLine, marsOrbitLine, venusOrbitLine, mercuryOrbitLine, saturnOrbitLine);
    earthGroup.add(moonOrbitLine);

    window.addEventListener("keydown", (event) => {
        if (event.key === "o" || event.key === "O") {
            showOrbits = !showOrbits;
            earthOrbitLine.visible = showOrbits;
            moonOrbitLine.visible = showOrbits;
            jupiterOrbitLine.visible = showOrbits;
            marsOrbitLine.visible = showOrbits;
            venusOrbitLine.visible = showOrbits;
            mercuryOrbitLine.visible = showOrbits;
            saturnOrbitLine.visible = showOrbits;
        }
    });
}

function createOrbitLine(a, b, segments) {
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitVertices = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Elliptical orbit: x = a * cos(theta), y = b * sin(theta)
        orbitVertices.push(a * Math.cos(theta), b * Math.sin(theta), 0);
    }
    orbitGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(orbitVertices, 3)
    );
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    return new THREE.LineLoop(orbitGeometry, orbitMaterial);
}

function animate() {
    if (!animationRunning) return;
    requestAnimationFrame(animate);

    sun.rotation.y += 0.005;
    earth.rotation.y += 0.024;
    moon.rotation.y += 0.001;
    jupiter.rotation.y += 0.0112;
    mars.rotation.y += 0.02;
    venus.rotation.y += 0.0288;
    mercury.rotation.y += 0.03952;
    saturn.rotation.y += 0.008;

    // Elliptical orbits
    angleEarth += 0.01;
    earthGroup.position.set(
        15 * Math.cos(angleEarth), // Semi-major axis for Earth
        10 * Math.sin(angleEarth), // Semi-minor axis for Earth
        0
    );

    angleMoon += 0.02;
    moonGroup.position.set(
        earthGroup.position.x / 5 + 0.1 * Math.cos(angleMoon), // Based on EarthGroup position
        earthGroup.position.y / 5 + 0.1 * Math.sin(angleMoon),
        0
    );

    angleJupiter += 0.007;
    jupiterGroup.position.set(
        25 * Math.cos(angleJupiter), // Semi-major axis for Jupiter
        20 * Math.sin(angleJupiter), // Semi-minor axis for Jupiter
        0
    );

    angleMars += 0.009;
    marsGroup.position.set(
        20 * Math.cos(angleMars), // Semi-major axis for Mars
        15 * Math.sin(angleMars), // Semi-minor axis for Mars
        0
    );

    angleVenus += 0.012;
    venusGroup.position.set(
        10 * Math.cos(angleVenus), // Semi-major axis for Venus
        8 * Math.sin(angleVenus), // Semi-minor axis for Venus
        0
    );

    angleMercury += 0.03;
    mercuryGroup.position.set(
        7 * Math.cos(angleMercury), // Semi-major axis for Mercury
        6 * Math.sin(angleMercury), // Semi-minor axis for Mercury
        0
    );

    angleSaturn += 0.004;
    saturnGroup.position.set(
        30 * Math.cos(angleSaturn), // Semi-major axis for Saturn
        25 * Math.sin(angleSaturn), // Semi-minor axis for Saturn
        0
    );

    controls.update();
    renderer.render(scene, camera);
}
