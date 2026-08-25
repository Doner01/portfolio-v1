document.addEventListener("DOMContentLoaded", () => {
  initStolasSpaceScene();
  initContactForm();
  initCopyEmail();
});

/* -------------------------------------------------------------
 * 1. Helluva Boss "Stolas Space" 3D Engine (Three.js)
 * ------------------------------------------------------------- */
function initStolasSpaceScene() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Butun sahnani birga harakatlantiruvchi guruh
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  /* --- A. Markaziy Gigant Supernova Quyoshi (Central White/Pink Sun) --- */
  const sunGeo = new THREE.SphereGeometry(2.8, 36, 36);
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xfff0fd,
    transparent: true,
    opacity: 0.95
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 1.2, -4);
  worldGroup.add(sunMesh);

  // Quyosh tashqi nurli atmosferasi (Corona Glow)
  const coronaGeo = new THREE.SphereGeometry(3.6, 32, 32);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xd946ef,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  coronaMesh.position.copy(sunMesh.position);
  worldGroup.add(coronaMesh);

  /* --- B. Chapdagi Moviy/Binafsha Gaz Giganti (Left Blue/Purple Gas Giant) --- */
  function createGasGiantTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, "#1e1b4b");
    grad.addColorStop(0.2, "#4338ca");
    grad.addColorStop(0.35, "#3b82f6");
    grad.addColorStop(0.5, "#818cf8");
    grad.addColorStop(0.65, "#4f46e5");
    grad.addColorStop(0.85, "#2e1065");
    grad.addColorStop(1.0, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // To'lqinsimon chiziqlar
    ctx.fillStyle = "rgba(192, 132, 252, 0.35)";
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(256, i * 40, 200 + Math.sin(i) * 60, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  const leftPlanetGeo = new THREE.SphereGeometry(1.65, 32, 32);
  const leftPlanetMat = new THREE.MeshBasicMaterial({
    map: createGasGiantTexture(),
    transparent: true,
    opacity: 0.95
  });
  const leftPlanet = new THREE.Mesh(leftPlanetGeo, leftPlanetMat);
  leftPlanet.position.set(-4.2, 2.0, -1.5);
  leftPlanet.rotation.z = Math.PI / 8;
  worldGroup.add(leftPlanet);

  // Chap sayyora tashqi kontur nuri
  const leftAuraGeo = new THREE.SphereGeometry(1.75, 24, 24);
  const leftAuraMat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const leftAura = new THREE.Mesh(leftAuraGeo, leftAuraMat);
  leftAura.position.copy(leftPlanet.position);
  worldGroup.add(leftAura);

  /* --- C. O'ngdagi Oltin Halqali Qahrabo Sayyora (Right Ringed Amber Planet) --- */
  function createAmberPlanetTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0.0, "#ea580c");
    grad.addColorStop(0.3, "#f97316");
    grad.addColorStop(0.6, "#c026d3");
    grad.addColorStop(0.85, "#701a75");
    grad.addColorStop(1.0, "#4a044e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(150 + i * 30, 200 + i * 25, 80, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  const rightPlanetGeo = new THREE.SphereGeometry(1.25, 32, 32);
  const rightPlanetMat = new THREE.MeshBasicMaterial({
    map: createAmberPlanetTexture(),
    transparent: true,
    opacity: 0.95
  });
  const rightPlanet = new THREE.Mesh(rightPlanetGeo, rightPlanetMat);
  rightPlanet.position.set(4.0, 0.8, -1.0);
  worldGroup.add(rightPlanet);

  // O'ng sayyoraning Oltin Halqasi (Glowing Saturn Ring)
  const ringGeo = new THREE.RingGeometry(1.6, 2.3, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });
  const saturnRing = new THREE.Mesh(ringGeo, ringMat);
  saturnRing.position.copy(rightPlanet.position);
  saturnRing.rotation.x = Math.PI / 2.2;
  saturnRing.rotation.y = -Math.PI / 7;
  worldGroup.add(saturnRing);

  /* --- D. Miltillovchi Yulduzlar Maydoni (Twinkling Starfield) --- */
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1400;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 28;
    starPositions[i + 1] = (Math.random() - 0.5) * 22;
    starPositions[i + 2] = (Math.random() - 0.5) * 16;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0xffffff,
    transparent: true,
    opacity: 0.85
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  /* --- E. Uchuvchi Kometalar (Shooting Stars / Comets) --- */
  const comets = [];
  function launchComet() {
    const cometGeo = new THREE.BufferGeometry();
    const trailCount = 25;
    const positions = new Float32Array(trailCount * 3);

    const startX = (Math.random() - 0.5) * 18 + 5;
    const startY = (Math.random() - 0.5) * 10 + 4;
    const startZ = (Math.random() - 0.5) * 4;

    for (let i = 0; i < trailCount; i++) {
      positions[i * 3] = startX + i * 0.1;
      positions[i * 3 + 1] = startY + i * 0.06;
      positions[i * 3 + 2] = startZ;
    }

    cometGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const cometMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.95
    });
    const cometLine = new THREE.Line(cometGeo, cometMat);
    scene.add(cometLine);

    comets.push({
      mesh: cometLine,
      vx: -0.16 - Math.random() * 0.08,
      vy: -0.09 - Math.random() * 0.05,
      life: 1.0
    });
  }

  setInterval(() => {
    if (comets.length < 5) launchComet();
  }, 2000);

  /* --- F. Sichqoncha Parallaksi va Animatsiya --- */
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    leftPlanet.rotation.y += 0.002;
    leftAura.rotation.y += 0.003;

    rightPlanet.rotation.y += 0.003;
    saturnRing.rotation.z += 0.001;

    coronaMesh.rotation.z -= 0.0015;
    starField.rotation.y -= 0.0002;

    // Kometalar harakati
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.mesh.position.x += c.vx;
      c.mesh.position.y += c.vy;
      c.life -= 0.016;
      c.mesh.material.opacity = Math.max(0, c.life);

      if (c.life <= 0) {
        scene.remove(c.mesh);
        comets.splice(i, 1);
      }
    }

    // Kamera mayin harakati
    camera.position.x += (mouseX * 0.65 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.65 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

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
      btn.innerHTML = "✓ Nusxalandi!";
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