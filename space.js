const canvas = document.getElementById("bg");

// ===== SETUP =====
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// مهم بزاف باش يبقى فالخلفية
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

// ===== STARS =====
const starCount = 11000;
const starGeo = new THREE.BufferGeometry();
const positions = [];
const speeds = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 3000,
    -Math.random() * 4500
  );
  speeds.push(Math.random() * 1.3 + 0.8);
}

starGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

const starMat = new THREE.PointsMaterial({
  color: 0xffffff,       // WHITE
  size: 1.8,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ===== METEORS =====
const meteors = [];

function spawnMeteor() {
  const geo = new THREE.SphereGeometry(1.6, 14, 14);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff8a2a // ORANGE
  });

  const m = new THREE.Mesh(geo, mat);

  m.position.set(
    Math.random() * 1000 - 500,
    Math.random() * 700 + 300,
    -Math.random() * 1200
  );

  m.velocity = {
    x: -(Math.random() * 12 + 8),
    y: -(Math.random() * 12 + 8),
    z: Math.random() * 7 + 4
  };

  meteors.push(m);
  scene.add(m);
}

setInterval(spawnMeteor, 280);

// ===== ANIMATE =====
function animate() {
  requestAnimationFrame(animate);

  const pos = starGeo.attributes.position.array;

  for (let i = 0; i < pos.length; i += 3) {
    pos[i + 2] += speeds[i / 3] * 4.5;

    if (pos[i + 2] > 120) {
      pos[i + 2] = -4500;
      pos[i] = (Math.random() - 0.5) * 3000;
      pos[i + 1] = (Math.random() - 0.5) * 3000;
    }
  }

  starGeo.attributes.position.needsUpdate = true;

  // Smooth glow
  starMat.opacity = 0.8 + Math.sin(Date.now() * 0.002) * 0.2;

  // Meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];

    m.position.x += m.velocity.x;
    m.position.y += m.velocity.y;
    m.position.z += m.velocity.z;

    if (
      m.position.x < -1200 ||
      m.position.y < -900 ||
      m.position.z > 400
    ) {
      scene.remove(m);
      meteors.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
}

animate();

// ===== RESIZE =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
