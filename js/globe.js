/**
 * globe.js — Interactive 3D Threat Telemetry Globe & Cyber Radar
 * - Rotates slowly by default.
 * - On hover (no clicking/holding required), dynamically changes rotation direction:
 *     Hovering on the left spins the globe left; hovering on the right spins it right.
 * - Returns to gentle default rotation when cursor leaves.
 */

// Continent clusters [lat, lon, latRadius, lonRadius]
const LAND_MASSES = [
  [10, 20, 34, 24],    // Africa
  [-8, 22, 30, 18],    // Southern Africa
  [52, 12, 17, 40],    // Europe
  [45, 90, 32, 62],    // Asia
  [30, 46, 16, 18],    // Middle East
  [22, 80, 14, 16],    // South Asia / India (Chennai focus)
  [58, -102, 26, 46],  // North America
  [40, -95, 16, 26],   // USA / Central
  [-18, -60, 32, 20],  // South America
  [-28, 134, 13, 22],  // Australia
  [72, -42, 11, 26],   // Greenland
  [-82, 0, 10, 180],   // Antarctica
];

const THREAT_TYPES = [
  'DDOS_AMPLIFICATION', 'ZERO_DAY_EXPLOIT', 'BRUTE_FORCE_SSH', 
  'DNS_TUNNEL_EXFIL', 'API_PAYLOAD_INJECT', 'SQL_INJECTION', 
  'RANSOMWARE_BEACON', 'BGP_HIJACK_ATTEMPT'
];

const TARGET_CITIES = [
  { name: 'Chennai Node', lat: 13.08, lon: 80.27, isHome: true },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68 },
  { name: 'Tokyo', lat: 35.67, lon: 139.65 },
  { name: 'San Francisco', lat: 37.77, lon: -122.41 },
  { name: 'Singapore', lat: 1.35, lon: 103.81 },
  { name: 'London', lat: 51.50, lon: -0.12 },
  { name: 'Sydney', lat: -33.86, lon: 151.20 },
  { name: 'Bengaluru', lat: 12.97, lon: 77.59 }
];

function isLand(lat, lon) {
  for (const [la, lo, dla, dlo] of LAND_MASSES) {
    let d = ((lon - lo + 540) % 360) - 180;
    const a = (lat - la) / dla;
    const b = d / dlo;
    if (a * a + b * b < 1) return true;
  }
  return false;
}

export async function initGlobe(container) {
  if (!container) return;

  const threatCountEl = document.getElementById('threat-count');
  const nodeCountEl = document.getElementById('node-count');
  const coordEl = document.getElementById('coord');
  const threatFeedEl = document.getElementById('threat-feed');

  let interceptedCount = 1842;
  let onlineNodes = 96;

  if (threatCountEl) threatCountEl.textContent = interceptedCount.toLocaleString();
  if (nodeCountEl) nodeCountEl.textContent = onlineNodes.toString();

  // Try loading Three.js dynamically
  let THREE = null;
  try {
    const module = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    THREE = module;
  } catch (err) {
    console.warn('Three.js CDN unavailable, switching to high-fidelity Canvas Cyber Radar engine.', err);
  }

  const wrap = container.closest('.globe-wrap') || container;

  if (THREE) {
    setupThreeGlobe(container, wrap, THREE, {
      onCoordUpdate: (lat, lon) => {
        if (coordEl) coordEl.textContent = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
      }
    });
  } else {
    setupCanvasRadar(container, wrap, {
      onCoordUpdate: (lat, lon) => {
        if (coordEl) coordEl.textContent = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
      }
    });
  }

  // Periodic simulated live threat event
  setInterval(() => {
    interceptedCount += Math.floor(Math.random() * 3) + 1;
    if (threatCountEl) threatCountEl.textContent = interceptedCount.toLocaleString();

    const target = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
    const threat = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
    pushThreatFeed(`${threat} -> ${target.name} [INTERCEPTED]`);
  }, 2600);

  function pushThreatFeed(msg) {
    if (!threatFeedEl) return;
    const li = document.createElement('li');
    const time = new Date().toTimeString().split(' ')[0];
    li.innerHTML = `<span class="time">[${time}]</span> <span class="tag">CRIT</span> ${msg}`;
    threatFeedEl.prepend(li);
    while (threatFeedEl.children.length > 5) {
      threatFeedEl.removeChild(threatFeedEl.lastChild);
    }
  }
}

/**
 * Three.js 3D Particle Globe with Hover-Only Direction Reversal
 */
function setupThreeGlobe(container, wrap, THREE, callbacks) {
  const width = container.clientWidth || 360;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 240;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Wireframe atmosphere sphere
  const sphereGeom = new THREE.SphereGeometry(78, 24, 24);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x112233,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
  globeGroup.add(sphereMesh);

  // Generate continent land particles
  const landPoints = [];
  const radius = 80;
  const DEG = Math.PI / 180;

  for (let lat = -80; lat <= 80; lat += 2.8) {
    const latRad = lat * DEG;
    const circumference = Math.cos(latRad);
    const numPoints = Math.max(6, Math.floor(circumference * 80));
    for (let i = 0; i < numPoints; i++) {
      const lon = (i / numPoints) * 360 - 180;
      if (isLand(lat, lon)) {
        const phi = (90 - lat) * DEG;
        const theta = (lon + 180) * DEG;
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        landPoints.push(x, y, z);
      }
    }
  }

  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute('position', new THREE.Float32BufferAttribute(landPoints, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x22e6ff,
    size: 2.0,
    transparent: true,
    opacity: 0.88
  });
  const pointsMesh = new THREE.Points(pGeom, pMat);
  globeGroup.add(pointsMesh);

  // City Nodes & Threat Beacons
  const nodeGeom = new THREE.BufferGeometry();
  const nodePositions = [];
  TARGET_CITIES.forEach(city => {
    const phi = (90 - city.lat) * DEG;
    const theta = (city.lon + 180) * DEG;
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    nodePositions.push(x, y, z);
  });
  nodeGeom.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0x3dff8a,
    size: 5.0,
    transparent: true,
    opacity: 1.0
  });
  const nodesMesh = new THREE.Points(nodeGeom, nodeMat);
  globeGroup.add(nodesMesh);

  // =========================================================================
  // HOVER-ONLY INTERACTION LOGIC (NO CLICK/HOLD REQUIRED)
  // - Default: Slowly rotates at BASE_SPEED (0.003 rad/frame)
  // - Hover on Left half: Rotates Left (counter-clockwise)
  // - Hover on Right half: Rotates Right (clockwise)
  // - Cursor leaves: Gently returns to default rotation
  // =========================================================================
  const BASE_SPEED = 0.003;
  let currentSpeedY = BASE_SPEED;
  let targetSpeedY = BASE_SPEED;
  let targetTiltX = 0;

  // Track hover movement
  wrap.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Normalized -1 (far left) to +1 (far right)
    const normX = (e.clientX - cx) / (rect.width / 2);
    const normY = (e.clientY - cy) / (rect.height / 2);

    // Direction changes based on cursor hover position:
    // Left side of globe (< 0) -> rotates Left (negative speed)
    // Right side of globe (> 0) -> rotates Right (positive speed)
    if (normX < -0.05) {
      targetSpeedY = -0.0045 - Math.abs(normX) * 0.004; // Rotate Left
    } else if (normX > 0.05) {
      targetSpeedY = 0.0045 + Math.abs(normX) * 0.004; // Rotate Right
    } else {
      targetSpeedY = 0; // Near center, pauses or moves minimally
    }

    // Subtle natural tilt toward cursor
    targetTiltX = -normY * 0.35;

    // Update coordinate telemetry
    callbacks.onCoordUpdate(normY * -70, normX * 150);
  });

  wrap.addEventListener('pointerleave', () => {
    // Return to default slow rotation when hover ends
    targetSpeedY = BASE_SPEED;
    targetTiltX = 0;
  });

  // Render loop with smooth interpolation
  function animate() {
    requestAnimationFrame(animate);

    // Smooth speed transition across direction reversals
    currentSpeedY += (targetSpeedY - currentSpeedY) * 0.06;
    globeGroup.rotation.y += currentSpeedY;

    // Smooth tilt on X axis
    globeGroup.rotation.x += (targetTiltX - globeGroup.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || 360;
    const h = container.clientHeight || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/**
 * Procedural Canvas 2D/3D Cyber Radar fallback with Hover Direction Reversal
 */
function setupCanvasRadar(container, wrap, callbacks) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.innerHTML = '';
  container.appendChild(canvas);

  let w = container.clientWidth || 360;
  let h = container.clientHeight || 360;
  let angle = 0;
  const BASE_SPEED = 0.016;
  let currentSpeed = BASE_SPEED;
  let targetSpeed = BASE_SPEED;

  function resize() {
    w = container.clientWidth || 360;
    h = container.clientHeight || 360;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(2, 2);
  }
  resize();
  window.addEventListener('resize', resize);

  wrap.addEventListener('pointermove', (e) => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const normX = (e.clientX - cx) / (rect.width / 2);
    const normY = (e.clientY - cy) / (rect.height / 2);

    // Hover direction: left vs right
    if (normX < -0.05) {
      targetSpeed = -0.02 - Math.abs(normX) * 0.015; // Rotate Left
    } else if (normX > 0.05) {
      targetSpeed = 0.02 + Math.abs(normX) * 0.015; // Rotate Right
    } else {
      targetSpeed = 0;
    }

    callbacks.onCoordUpdate(-normY * 70, normX * 150);
  });

  wrap.addEventListener('pointerleave', () => {
    targetSpeed = BASE_SPEED;
  });

  function drawRadar() {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) * 0.82;

    currentSpeed += (targetSpeed - currentSpeed) * 0.06;
    angle += currentSpeed;

    // Rings
    ctx.strokeStyle = 'rgba(34, 230, 255, 0.25)';
    ctx.lineWidth = 1;
    [0.3, 0.6, 0.9, 1.0].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * factor, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();

    // Rotating Longitude Ellipses
    ctx.save();
    ctx.strokeStyle = 'rgba(61, 255, 138, 0.4)';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      const offset = (angle + i * 0.8) % Math.PI;
      const rx = Math.sin(offset) * r;
      ctx.ellipse(cx, cy, Math.abs(rx), r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Radar Sweep Beam
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle * 1.5);
    const grad = ctx.createLinearGradient(0, 0, r, 0);
    grad.addColorStop(0, 'rgba(34, 230, 255, 0.7)');
    grad.addColorStop(1, 'rgba(34, 230, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, 0, 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // City Targets
    TARGET_CITIES.forEach((c, idx) => {
      const pAngle = (c.lon * Math.PI) / 180 + angle * 0.5;
      const px = cx + Math.cos(pAngle) * (r * 0.65);
      const py = cy + Math.sin(pAngle) * (r * 0.45);

      ctx.fillStyle = c.isHome ? '#22e6ff' : idx % 2 === 0 ? '#3dff8a' : '#ff2bd6';
      ctx.beginPath();
      ctx.arc(px, py, c.isHome ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();

      if (c.isHome) {
        ctx.strokeStyle = 'rgba(34, 230, 255, 0.8)';
        ctx.strokeRect(px - 7, py - 7, 14, 14);
      }
    });

    requestAnimationFrame(drawRadar);
  }

  drawRadar();
}
