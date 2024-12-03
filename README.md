# Solar System Simulation with WebGL and Three.js
![image](https://github.com/user-attachments/assets/3abda30c-e738-4729-aeea-f954d41ca395)

## Overview
This program is a WebGL-based solar system simulation built using Three.js. It features:

- View and move around the solar system using OrbitControls.
- Dynamic camera movement via keyboard inputs (`W`, `A`, `S`, `D`, Arrow keys).
- Toggle rotation and orbit animations on/off using the `E` key.
- Reset camera position with the `R` key.
- Simulate planetary rotations and orbital movements, with orbital tracks toggled by the `O` key.
- Realistic textures for planets.

The simulation runs in a browser and renders the 3D scene on an HTML `<canvas>` element.

---

## Development and Runtime Environment
### Dependencies
The program requires the following:

- **Three.js**: For 3D graphics and rendering.
- **OrbitControls**: For interactive camera controls.
- **Node.js Modules**: Including `gl-matrix` for mathematical computations.
- **Babel**: For ES6+ JavaScript compatibility.

### Setup Instructions
1. Ensure the project includes proper textures in the `textures/` directory (e.g., `stars.jpg`, `sun2.jpeg`, `earth2.jpeg`).
2. Install dependencies via npm:
   ```bash
   npm install
   ```
3. Build the project using:
   ```bash
   npx webpack
   ```
4. Serve the project locally using:
   ```bash
   npx webpack serve
   ```
   Access the application through the localhost URL provided by Webpack.

---

## System Design and Algorithm Principles
### Core Components
1. **Scene**: A `THREE.Scene` holds all objects in the simulation.
2. **Camera**: A `THREE.PerspectiveCamera` observes the scene.
3. **Renderer**: A `THREE.WebGLRenderer` draws the scene onto the canvas.
4. **OrbitControls**: Enables interactive scene exploration.

### Implementation Steps
1. **Load Textures**: Import planet textures (e.g., Sun, Earth, Moon).
2. **Create Planets**:
   - Use `THREE.SphereGeometry` for the shape.
   - Apply textures using `THREE.MeshPhongMaterial`.
3. **Add Lighting**:
   - Include ambient and point lights to mimic sunlight.
4. **Group Planets**:
   - Use `THREE.Object3D()` to group planets and simulate relationships (e.g., Moon orbits Earth).
5. **Animation**:
   - Use `requestAnimationFrame` for rendering and animating orbits.

---

## Key Implementation Details
### Orbital Controls
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movements
controls.minDistance = 10; // Limit zoom-in
controls.maxDistance = 100; // Limit zoom-out
```

### Planet Initialization (Earth Example)
```javascript
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load("./textures/earth2.jpeg")
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

const earthGroup = new THREE.Object3D(); // Group for Earth and its orbit
earthGroup.add(earth);
```

### Lighting (Sunlight Example)
```javascript
const pointLight = new THREE.PointLight(0xffffff, 20, 200, 0.5);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
scene.add(ambientLight, pointLight);
```

### Elliptical Orbits (Earth Example)
```javascript
angleEarth += 0.01;
earthGroup.position.set(
  15 * Math.cos(angleEarth), // Semi-major axis for Earth
  10 * Math.sin(angleEarth), // Semi-minor axis for Earth
  0
);
```

---

## Results
### Features Demonstrated
1. Initial state with all planets in their correct positions.
2. Ability to rotate and move the system using mouse and keyboard shortcuts.
3. Toggle orbit lines visibility using the `O` key.

---

## References
- [Three.js Documentation](https://threejs.org/docs/#api/en/)

