document.addEventListener("DOMContentLoaded", () => {
  initCosmicSpace();
  initContactForm();
  initCopyEmail();
});

/* -------------------------------------------------------------
 * 1. Three.js Space Engine (Planet, Starfield & Shooting Comets)
 * ------------------------------------------------------------- */
function initCosmicSpace() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 1. Markaziy 3D Kosmik Sayyora guruhi
  const cosmosGroup = new THREE.Group();
  scene.add(cosmosGroup);

  // Sayyora tanasi (Glowing Planet Sphere)
  const planetGeo = new THREE.SphereGeometry(2.0, 32, 32);
  const planetMat = new THREE.MeshBasicMaterial({
    color: 0x6b21a8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const planetMesh = new THREE.Mesh(planetGeo, planetMat);
  cosmosGroup.add(planetMesh);

  // Sayyora ichki yadrosi
  const innerGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xd946ef,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  cosmosGroup.add(innerMesh);

  // Orbital Kosmik Halqa (Saturn-like Ring)
  const ringGeo = new THREE.RingGeometry(2.6, 3.2, 40);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2.3;
  ringMesh.rotation.y = Math.PI / 6;
  cosmosGroup.add(ringMesh);

  // 2. Yulduzlar to'dasi (Starfield - 1200 yulduz)
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1200;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 25;
    starPositions[i + 1] = (Math.random() - 0.5) * 25;
    starPositions[i + 2] = (Math.random() - 0.5) * 20;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // 3. Uchuvchi Kometalar (Shooting Comets / Meteors)
  const comets = [];
  function createComet() {
    const cometGeo = new THREE.BufferGeometry();
    const trailPoints = 20;
    const cometPositions = new Float32Array(trailPoints * 3);

    const startX = (Math.random() - 0.5) * 16 + 6;
    const startY = (Math.random() - 0.5) * 8 + 4;
    const startZ = (Math.random() - 0.5) * 4;

    for (let i = 0; i < trailPoints; i++) {
      cometPositions[i * 3] = startX + i * 0.08;
      cometPositions[i * 3 + 1] = startY + i * 0.05;
      cometPositions[i * 3 + 2] = startZ;
    }

    cometGeo.setAttribute("position", new THREE.BufferAttribute(cometPositions, 3));
    const cometMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.9
    });
    const cometLine = new THREE.Line(cometGeo, cometMat);
    scene.add(cometLine);

    comets.push({
      mesh: cometLine,
      vx: -0.15 - Math.random() * 0.1,
      vy: -0.09 - Math.random() * 0.06,
      life: 1.0
    });
  }

  // Har 2-3 soniyada tasodifiy kometa uchishi
  setInterval(() => {
    if (comets.length < 4) createComet();
  }, 2200);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animatsiya tsikli
  function animate() {
    requestAnimationFrame(animate);

    planetMesh.rotation.y += 0.002;
    innerMesh.rotation.x -= 0.004;
    ringMesh.rotation.z += 0.001;

    starField.rotation.y -= 0.0003;

    // Kometalar harakati
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.mesh.position.x += c.vx;
      c.mesh.position.y += c.vy;
      c.life -= 0.015;
      c.mesh.material.opacity = Math.max(0, c.life);

      if (c.life <= 0) {
        scene.remove(c.mesh);
        comets.splice(i, 1);
      }
    }

    // Parallax
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

function initCopyEmail() {
  const btn = document.getElementById("copy-email-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = btn.getAttribute("data-email");
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      const originalText = btn.innerHTML;
      btn.innerHTML = "✓ Nusxalandi / Copied!";
      btn.style.borderColor = "#facc15";
      btn.style.color = "#facc15";

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "🚀 ...";
    status.style.color = "#facc15";

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
        status.style.color = "#facc15";
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