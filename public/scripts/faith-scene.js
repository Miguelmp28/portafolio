import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("bg3d");
if (!canvas) throw new Error("Canvas #bg3d no encontrado");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const root = new THREE.Group();
scene.add(root);

const starsCount = 1700;
const points = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
  const i3 = i * 3;
  points[i3] = (Math.random() - 0.5) * 46;
  points[i3 + 1] = (Math.random() - 0.5) * 30;
  points[i3 + 2] = (Math.random() - 0.5) * 30;
}
const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute("position", new THREE.BufferAttribute(points, 3));
const stars = new THREE.Points(
  starsGeo,
  new THREE.PointsMaterial({
    color: 0xffc26b,
    size: 0.06,
    transparent: true,
    opacity: 0.58,
  })
);
root.add(stars);

const styleCross = new THREE.Group();
const crossMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xff6b88,
  emissiveIntensity: 2.4,
  metalness: 0.08,
  roughness: 0.2,
});
const crossVertical = new THREE.Mesh(new THREE.BoxGeometry(0.62, 5.6, 0.62), crossMaterial);
const crossHorizontal = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.62, 0.62), crossMaterial);
crossHorizontal.position.y = 1.05;
styleCross.add(crossVertical, crossHorizontal);
const crossGlowMat = new THREE.MeshBasicMaterial({
  color: 0xff89a2,
  transparent: true,
  opacity: 0.24,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const crossGlowV = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 7.2), crossGlowMat);
const crossGlowH = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.1), crossGlowMat);
crossGlowH.position.y = 1.05;
styleCross.add(crossGlowV, crossGlowH);
root.add(styleCross);

const styleHope = new THREE.Group();
const hopeHaloA = new THREE.Mesh(
  new THREE.TorusGeometry(3.4, 0.12, 16, 140),
  new THREE.MeshBasicMaterial({ color: 0xffe3a3, transparent: true, opacity: 0.65 })
);
hopeHaloA.rotation.x = Math.PI / 2;
const hopeHaloB = new THREE.Mesh(
  new THREE.TorusGeometry(2.4, 0.07, 16, 120),
  new THREE.MeshBasicMaterial({ color: 0xfff7e1, transparent: true, opacity: 0.82 })
);
hopeHaloB.rotation.y = Math.PI / 2.3;
const hopeCore = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xfff8db,
    emissive: 0xffd992,
    emissiveIntensity: 1.75,
    roughness: 0.2,
    metalness: 0.15,
  })
);
styleHope.add(hopeHaloA, hopeHaloB, hopeCore);
root.add(styleHope);

const styleFaith = new THREE.Group();
const faithPath = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2.6, 0.11, 180, 18),
  new THREE.MeshStandardMaterial({
    color: 0xf4f4f5,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.1,
    roughness: 0.3,
    metalness: 0.2,
  })
);
faithPath.rotation.x = Math.PI / 2.3;
const faithBeacon = new THREE.Mesh(
  new THREE.ConeGeometry(0.85, 2.1, 30),
  new THREE.MeshStandardMaterial({
    color: 0xfff7e6,
    emissive: 0xffbc59,
    emissiveIntensity: 1.5,
    roughness: 0.25,
  })
);
faithBeacon.position.y = 2.25;
styleFaith.add(faithPath, faithBeacon);
root.add(styleFaith);

const ambient = new THREE.AmbientLight(0xffffff, 0.75);
const keyLight = new THREE.PointLight(0xffffff, 1.9, 55, 2);
keyLight.position.set(1.8, 2.8, 6);
const warmLight = new THREE.PointLight(0xffd48e, 1.85, 46, 2);
warmLight.position.set(-2.3, 0.2, 5.2);
const rimLight = new THREE.PointLight(0xff8fab, 1.1, 42, 2);
rimLight.position.set(0, 1.2, -5.8);
scene.add(ambient, keyLight, warmLight, rimLight);

const styles = {
  cross: styleCross,
  hope: styleHope,
  faith: styleFaith,
};

let activeStyle = "cross";
function applyStyle(styleName) {
  activeStyle = styleName in styles ? styleName : "cross";
  Object.entries(styles).forEach(([name, group]) => {
    group.visible = name === activeStyle;
  });

  document.querySelectorAll("[data-scene-style]").forEach((btn) => {
    const selected = btn.getAttribute("data-scene-style") === activeStyle;
    btn.classList.toggle("bg-zinc-900", selected);
    btn.classList.toggle("text-white", selected);
    btn.classList.toggle("border-zinc-900", selected);
    btn.classList.toggle("bg-white", !selected);
    btn.classList.toggle("text-zinc-700", !selected);
    btn.classList.toggle("border-zinc-300", !selected);
  });
}

document.querySelectorAll("[data-scene-style]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const styleName = btn.getAttribute("data-scene-style");
    applyStyle(styleName || "cross");
  });
});

applyStyle("cross");

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
  stars.rotation.y = t * 0.03;
  stars.rotation.x = Math.sin(t * 0.14) * 0.04;

  styleCross.rotation.y = t * 0.16;
  crossGlowV.scale.x = 1 + Math.sin(t * 1.8) * 0.08;
  crossGlowH.scale.y = 1 + Math.cos(t * 1.45) * 0.07;

  styleHope.rotation.z = t * 0.18;
  styleHope.rotation.x = Math.sin(t * 0.55) * 0.12;
  hopeCore.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);

  styleFaith.rotation.y = -t * 0.16;
  faithBeacon.position.y = 2.25 + Math.sin(t * 1.4) * 0.16;

  if (!reducedMotion) {
    root.rotation.x = pointer.y * 0.08;
    root.rotation.y += (pointer.x * 0.18 - root.rotation.y) * 0.04;
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.65 - camera.position.y) * 0.03;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
