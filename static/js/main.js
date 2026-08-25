document.addEventListener("DOMContentLoaded", () => {
  initStolasSpaceScene();
  initContactForm();
  initCopyEmail();
  initInstantLanguageSwitch();
});

/* -------------------------------------------------------------
 * 1. Three.js Space Engine (Black Hole & Right Ringed Planet)
 * ------------------------------------------------------------- */
function initStolasSpaceScene() {
  const container = document.getElementById("three-canvas-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  /* =============================================================
   * (1) 3D KOSMIK QORA TUYNUK (Top-Right Black Hole)
   * ============================================================= */
  const blackHoleGroup = new THREE.Group();
  blackHoleGroup.position.set(4.8, 2.8, -4.5); // O'ng yuqori qismda
  worldGroup.add(blackHoleGroup);

  // Hodisalar gorizonti (Event Horizon)
  const eventHorizonGeo = new THREE.SphereGeometry(1.25, 32, 32);
  const eventHorizonMat = new THREE.MeshBasicMaterial({
    color: 0x000000
  });
  const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
  blackHoleGroup.add(eventHorizon);

  // Foton sfera nurlanishi (Photon Sphere Aura)
  const photonSphereGeo = new THREE.SphereGeometry(1.38, 28, 28);
  const photonSphereMat = new THREE.MeshBasicMaterial({
    color: 0xe879f9,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const photonSphere = new THREE.Mesh(photonSphereGeo, photonSphereMat);
  blackHoleGroup.add(photonSphere);

  // Akkretsion disk (Accretion Disk)
  function createAccretionTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(256, 256, 110, 256, 256, 256);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    grad.addColorStop(0.18, "rgba(250, 204, 21, 0.9)");
    grad.addColorStop(0.45, "rgba(217, 70, 239, 0.8)");
    grad.addColorStop(0.75, "rgba(147, 51, 234, 0.4)");
    grad.addColorStop(1.0, "rgba(7, 2, 20, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }

  const diskGeo = new THREE.RingGeometry(1.45, 3.6, 64);
  const diskMat = new THREE.MeshBasicMaterial({
    map: createAccretionTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95
  });
  const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
  accretionDisk.rotation.x = Math.PI / 2.3;
  accretionDisk.rotation.y = Math.PI / 8;
  blackHoleGroup.add(accretionDisk);

  /* =============================================================
   * (2) O'NG PASTKI OLTIN HALQALI SAYYORA (Biroz o'ngroqqa surildi)
   * ============================================================= */
  function createAmberPlanetTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0.0, "#ea580c");
    grad.addColorStop(0.35, "#f97316");
    grad.addColorStop(0.7, "#c026d3");
    grad.addColorStop(1.0, "#3b0764");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "rgba(251, 191, 36, 0.45)";
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(160 + i * 30, 180 + i * 30, 80, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }

  const rightPlanetGeo = new THREE.SphereGeometry(1.7, 32, 32);
  const rightPlanetMat = new THREE.MeshBasicMaterial({
    map: createAmberPlanetTexture(),
    transparent: true,
    opacity: 0.95
  });
  const rightPlanet = new THREE.Mesh(rightPlanetGeo, rightPlanetMat);
  rightPlanet.position.set(7.2, -3.2, -1.8); // O'ngroqqa surilgan koordinata
  worldGroup.add(rightPlanet);

  // Katta Oltin Halqa
  const ringGeo = new THREE.RingGeometry(2.2, 3.3, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  const saturnRing = new THREE.Mesh(ringGeo, ringMat);
  saturnRing.position.copy(rightPlanet.position);
  saturnRing.rotation.x = Math.PI / 2.2;
  saturnRing.rotation.y = -Math.PI / 7;
  worldGroup.add(saturnRing);

  /* --- Yulduzlar to'dasi (1400 Stars) --- */
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1400;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 34;
    starPositions[i + 1] = (Math.random() - 0.5) * 28;
    starPositions[i + 2] = (Math.random() - 0.5) * 20;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.038,
    color: 0xffffff,
    transparent: true,
    opacity: 0.85
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  /* --- Uchuvchi Kometalar --- */
  const comets = [];
  function launchComet() {
    const cometGeo = new THREE.BufferGeometry();
    const trailCount = 20;
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
      opacity: 0.9
    });
    const cometLine = new THREE.Line(cometGeo, cometMat);
    scene.add(cometLine);

    comets.push({
      mesh: cometLine,
      vx: -0.15 - Math.random() * 0.08,
      vy: -0.09 - Math.random() * 0.05,
      life: 1.0
    });
  }

  setInterval(() => {
    if (comets.length < 4) launchComet();
  }, 2200);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    rightPlanet.rotation.y += 0.003;
    saturnRing.rotation.z += 0.001;

    accretionDisk.rotation.z += 0.006;
    photonSphere.rotation.y -= 0.004;

    starField.rotation.y -= 0.0002;

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

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.04;
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

/* -------------------------------------------------------------
 * 2. Zudlik bilan Tilni Almashtirish (No Reload / No Scroll Jump)
 * ------------------------------------------------------------- */
function initInstantLanguageSwitch() {
  const transElem = document.getElementById("i18n-translations");
  const projElem = document.getElementById("i18n-projects");
  const skillsElem = document.getElementById("i18n-skills");

  if (!transElem || !projElem || !skillsElem) return;

  const translations = JSON.parse(transElem.textContent);
  const projectsData = JSON.parse(projElem.textContent);
  const skillsData = JSON.parse(skillsElem.textContent);

  const buttons = document.querySelectorAll(".lang-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = btn.getAttribute("data-lang");
      if (!lang || !translations[lang]) return;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const t = translations[lang];
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) {
          el.innerHTML = t[key];
        }
      });

      const projContainer = document.getElementById("projects-container");
      if (projContainer && projectsData[lang]) {
        projContainer.innerHTML = projectsData[lang].map(p => `
          <article class="project-card">
            <div>
              <div class="project-card__badge">${p.category}</div>
              <h3 class="project-card__title">${p.title}</h3>
              <p class="project-card__summary">${p.summary}</p>
            </div>
            <div>
              <div class="project-card__tags">
                ${p.tech.map(tag => `<span class="tag">${tag}</span>`).join("")}
              </div>
              <div class="project-card__links">
                <a href="${p.github}" target="_blank">${t.source_code}</a>
                <a href="${p.live_demo}">${t.live_demo}</a>
              </div>
            </div>
          </article>
        `).join("");
      }

      const skillsContainer = document.getElementById("skills-container");
      if (skillsContainer && skillsData[lang]) {
        skillsContainer.innerHTML = Object.entries(skillsData[lang]).map(([category, items]) => `
          <div class="glass-panel" style="padding: 1.75rem;">
            <h3 style="margin-bottom: 1.5rem; font-size: 1.15rem; color: #facc15;">${category}</h3>
            ${items.map(skill => `
              <div class="skill-item">
                <div class="skill-item__meta">
                  <span>${skill.name}</span>
                  <span class="mono" style="color: #c4b5fd;">${skill.level}%</span>
                </div>
                <div class="skill-item__bar">
                  <div class="skill-item__fill" style="width: ${skill.level}%;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        `).join("");
      }

      fetch(`/set-lang/${lang}`).catch(() => {});
    });
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