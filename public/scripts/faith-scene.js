import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("bg3d");
if (!canvas) throw new Error("Canvas #bg3d no encontrado");

const select = document.getElementById("sceneStyleSelect");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf4f4f5, 10, 38);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0.55, 11.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const root = new THREE.Group();
scene.add(root);

const styles = {
  sunrise: new THREE.Group(),
  path: new THREE.Group(),
  pulse: new THREE.Group(),
  sky: new THREE.Group(),
  unity: new THREE.Group(),
};
Object.values(styles).forEach((g) => root.add(g));

const ambient = new THREE.AmbientLight(0xffffff, 0.62);
const warm = new THREE.PointLight(0xf59e0b, 1.65, 38, 2);
warm.position.set(-2.1, 1.8, 5.6);
const key = new THREE.PointLight(0xffffff, 1.45, 34, 2);
key.position.set(2.4, 2.4, 5.3);
scene.add(ambient, warm, key);

// 1) Luz del Amanecer
{
  const g = styles.sunrise;
  const horizon = new THREE.Mesh(
    new THREE.CircleGeometry(6.5, 64),
    new THREE.MeshBasicMaterial({ color: 0xe7e5e4, transparent: true, opacity: 0.38 })
  );
  horizon.rotation.x = -Math.PI / 2;
  horizon.position.y = -1.8;
  g.add(horizon);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xfff7d6,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.2,
      roughness: 0.28,
    })
  );
  sun.position.set(0, -0.25, -2.2);
  g.add(sun);

  const rays = [];
  for (let i = 0; i < 8; i++) {
    const ray = new THREE.Mesh(
      new THREE.PlaneGeometry(0.45, 5.2),
      new THREE.MeshBasicMaterial({
        color: 0xfde68a,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    ray.position.set(0, 1.1, -2.8);
    ray.rotation.z = (i / 8) * Math.PI * 2;
    g.add(ray);
    rays.push(ray);
  }
  g.userData.rays = rays;
  g.userData.sun = sun;
}

// 2) Camino de Luz
{
  const g = styles.path;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.8, -1.7, 4.6),
    new THREE.Vector3(-2.1, -1.35, 1.5),
    new THREE.Vector3(-0.2, -1.1, -0.5),
    new THREE.Vector3(2, -0.8, -2.6),
    new THREE.Vector3(4.5, -0.5, -4.8),
  ]);

  const base = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 200, 0.3, 22, false),
    new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.74, metalness: 0.08 })
  );
  const lightPath = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 200, 0.07, 16, false),
    new THREE.MeshStandardMaterial({
      color: 0xfff7d6,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.35,
      roughness: 0.34,
    })
  );
  g.add(base, lightPath);
  g.userData.lightPath = lightPath;
}

// 3) Palpitacion de Esperanza
{
  const g = styles.pulse;
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 2),
    new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.25,
      roughness: 0.2,
      metalness: 0.1,
    })
  );
  g.add(core);

  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8 + i * 0.6, 0.04, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.45 - i * 0.1 })
    );
    ring.rotation.x = Math.PI / 2 + i * 0.2;
    g.add(ring);
    rings.push(ring);
  }
  g.userData.core = core;
  g.userData.rings = rings;
}

// 4) Cielo Vivo
{
  const g = styles.sky;
  const count = 1800;
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    data[i3] = (Math.random() - 0.5) * 26;
    data[i3 + 1] = (Math.random() - 0.5) * 18;
    data[i3 + 2] = (Math.random() - 0.5) * 22;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(data, 3));
  const cloud = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xdbeafe,
      size: 0.035,
      transparent: true,
      opacity: 0.72,
    })
  );
  g.add(cloud);
  g.userData.cloud = cloud;
}

// 5) Unidad
{
  const g = styles.unity;
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.45,
      roughness: 0.25,
    })
  );
  g.add(nucleus);

  const orbits = [];
  for (let i = 0; i < 4; i++) {
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2 + i * 0.5, 0.03, 14, 130),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xfbbf24 : 0xe2e8f0, transparent: true, opacity: 0.55 })
    );
    orbit.rotation.x = i * 0.6;
    orbit.rotation.y = i * 0.35;
    g.add(orbit);
    orbits.push(orbit);
  }
  g.userData.nucleus = nucleus;
  g.userData.orbits = orbits;
}

let activeStyle = "path";
function applyStyle(styleName) {
  activeStyle = styleName in styles ? styleName : "path";
  Object.entries(styles).forEach(([name, group]) => {
    group.visible = name === activeStyle;
  });
}

if (select) {
  select.value = activeStyle;
  select.addEventListener("change", () => {
    applyStyle(select.value);
  });
}
applyStyle(activeStyle);

const pointer = { x: 0, y: 0 };
window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  // shared stable motion
  if (!reducedMotion) {
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.025;
    camera.position.y += (0.55 + pointer.y * 0.18 - camera.position.y) * 0.025;
  }

  // style-specific animation
  const sunrise = styles.sunrise.userData;
  if (styles.sunrise.visible) {
    sunrise.sun.position.y = -0.25 + Math.sin(t * 0.7) * 0.12;
    sunrise.rays.forEach((ray, i) => {
      ray.material.opacity = 0.08 + (Math.sin(t * 0.9 + i) + 1) * 0.04;
    });
  }

  const path = styles.path.userData;
  if (styles.path.visible) {
    path.lightPath.material.emissiveIntensity = 1.25 + Math.sin(t * 1.8) * 0.28;
  }

  const pulse = styles.pulse.userData;
  if (styles.pulse.visible) {
    const p = 1 + Math.sin(t * 1.7) * 0.08;
    pulse.core.scale.setScalar(p);
    pulse.rings.forEach((ring, i) => {
      ring.rotation.z = t * (0.2 + i * 0.08);
      ring.material.opacity = 0.26 + (Math.sin(t * 1.3 + i) + 1) * 0.11;
    });
  }

  const sky = styles.sky.userData;
  if (styles.sky.visible) {
    sky.cloud.rotation.y = t * 0.03;
    sky.cloud.rotation.x = Math.sin(t * 0.4) * 0.06;
  }

  const unity = styles.unity.userData;
  if (styles.unity.visible) {
    unity.nucleus.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
    unity.orbits.forEach((orbit, i) => {
      orbit.rotation.z = t * (0.18 + i * 0.05);
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
