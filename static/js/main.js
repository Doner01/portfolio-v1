document.addEventListener("DOMContentLoaded", () => {
  init3DHero();
  initContactForm();
});

function init3DHero() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const meshGroup = new THREE.Group();
  scene.add(meshGroup);

  // 1. Tashqi 3D Icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  meshGroup.add(outerMesh);

  // 2. Ichki Glowing Dodecahedron (Geymer yadrosi)
  const coreGeo = new THREE.DodecahedronGeometry(1.2, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  meshGroup.add(coreMesh);

  // 3. Zarrachalar (Particle Field)
  const particlesGeo = new THREE.BufferGeometry();
  const count = 350;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 16;
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

    meshGroup.rotation.x += 0.0025;
    meshGroup.rotation.y += 0.0035;

    coreMesh.rotation.x -= 0.005;
    coreMesh.rotation.z += 0.004;

    particleField.rotation.y -= 0.0006;

    camera.position.x += (mouseX * 0.7 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.7 - camera.position.y) * 0.05;
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
        status.textContent = "✗ " + (data.message || "Error");
        status.style.color = "#ef4444";
      }
    } catch (err) {
      status.textContent = "✗ " + err.message;
      status.style.color = "#ef4444";
    }
  });
}