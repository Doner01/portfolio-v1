document.addEventListener("DOMContentLoaded", () => {
  init3DHero();
  initContactForm();
});

/* -------------------------------------------------------------
 * 1. Three.js 3D Hero Viewport
 * ------------------------------------------------------------- */
function init3DHero() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const meshGroup = new THREE.Group();
  scene.add(meshGroup);

  // Tashqi Icosahedron Wireframe
  const geometry = new THREE.IcosahedronGeometry(2.2, 1);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const icosahedron = new THREE.Mesh(geometry, wireframeMaterial);
  meshGroup.add(icosahedron);

  // Ichki Yadrosi
  const coreGeometry = new THREE.OctahedronGeometry(1.2, 0);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  meshGroup.add(core);

  // Zarrachalar to'dasi (Particle Field)
  const particlesGeo = new THREE.BufferGeometry();
  const count = 300;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }
  particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.6
  });
  const particleField = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particleField);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    meshGroup.rotation.x += 0.003;
    meshGroup.rotation.y += 0.004;

    core.rotation.x -= 0.006;
    core.rotation.z -= 0.004;

    particleField.rotation.y -= 0.0008;

    camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* -------------------------------------------------------------
 * 2. Aloqa Formasi Handler (Bilingual)
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "...";
    status.style.color = "#06b6d4";

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        status.textContent = "✓ " + data.message;
        status.style.color = "#10b981";
        form.reset();
      } else {
        status.textContent = "✗ " + (data.message || "Xatolik yuz berdi.");
        status.style.color = "#ef4444";
      }
    } catch (err) {
      status.textContent = "✗ " + err.message;
      status.style.color = "#ef4444";
    }
  });
}