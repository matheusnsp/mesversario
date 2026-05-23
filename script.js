// ─── TILT 3D (hover com inclinação direcional seguindo o mouse) ───
/*
const TILT_MAX   = 14;
const TILT_SCALE = 1.03;

function applyTilt(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * TILT_MAX;
    const rotY =  dx * TILT_MAX;

    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${TILT_SCALE})`;

    let shine = card.querySelector(".tilt-shine");
    if (!shine) {
      shine = document.createElement("div");
      shine.className = "tilt-shine";
      shine.style.cssText = `
        position:absolute; inset:0; border-radius:inherit;
        pointer-events:none; z-index:1; transition:opacity 0.12s ease;
      `;
      card.appendChild(shine);
    }
    const angle     = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    const intensity = Math.hypot(dx, dy) * 0.18;
    shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${intensity.toFixed(3)}) 0%, rgba(255,255,255,0) 60%)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.45s cubic-bezier(.23,1,.32,1)";
    card.style.transform  = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    const shine = card.querySelector(".tilt-shine");
    if (shine) shine.style.background = "none";
    setTimeout(() => { card.style.transition = ""; }, 450);
  });

  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.12s ease";
  });
}

document.querySelectorAll(".love-card, .letter-card").forEach(applyTilt);
*/

// ─── TIMER ───
const inicio = new Date(2025, 4, 24);
function updateTimer() {
  const agora = new Date();
  const diff = agora - inicio;
  const totalDias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const meses = Math.floor(totalDias / 30);
  const diasRestantes = totalDias % 30;
  const horas = agora.getHours();
  document.getElementById('t-meses').textContent = meses;
  document.getElementById('t-dias').textContent = diasRestantes;
  document.getElementById('t-horas').textContent = horas;
}
updateTimer();
setInterval(updateTimer, 60000);

// ─── TIMELINE 1 ANO ───
const timelineFill = document.getElementById('timeline-fill');
if (timelineFill) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => {
          timelineFill.style.width = 'calc(100% - 16px)';
        }, 300);
        tlObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  tlObserver.observe(timelineFill.parentElement);
}

// ─── CANVAS PARTÍCULAS ───
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const symbols = ['❤', '✦', '·'];
for (let i = 0; i < 55; i++) {
  particles.push({
    x: Math.random() * 1000,
    y: Math.random() * 1000,
    vy: -(0.15 + Math.random() * 0.35),
    vx: (Math.random() - 0.5) * 0.2,
    size: 8 + Math.random() * 12,
    alpha: 0.04 + Math.random() * 0.12,
    sym: symbols[Math.floor(Math.random() * symbols.length)]
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.y += p.vy;
    p.x += p.vx;
    if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = '#e8627a';
    ctx.font = `${p.size}px serif`;
    ctx.fillText(p.sym, p.x % W, p.y % H);
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// ─── LIGHTBOX (foto abre ao clicar) ───
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.style.cssText = `
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 2, 6, 0);
  backdrop-filter: blur(0px);
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
  transition: background 0.35s ease, backdrop-filter 0.35s ease;
`;
lightbox.innerHTML = `
  <img id="lightbox-img" src="" alt="" style="
    max-width: 90vw;
    max-height: 88vh;
    border-radius: 16px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7);
    transform: scale(0.88);
    opacity: 0;
    transition: transform 0.38s cubic-bezier(.23,1,.32,1), opacity 0.38s ease;
    cursor: default;
  ">
`;
document.body.appendChild(lightbox);

const lbImg = document.getElementById("lightbox-img");

function openLightbox(src) {
  lbImg.src = src;
  lightbox.style.display = "flex";

  // força reflow pra animação funcionar
  lightbox.offsetHeight;

  lightbox.style.background = "rgba(10, 2, 6, 0.92)";
  lightbox.style.backdropFilter = "blur(12px)";
  lbImg.style.transform = "scale(1)";
  lbImg.style.opacity   = "1";

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.style.background    = "rgba(10, 2, 6, 0)";
  lightbox.style.backdropFilter = "blur(0px)";
  lbImg.style.transform = "scale(0.88)";
  lbImg.style.opacity   = "0";

  setTimeout(() => {
    lightbox.style.display = "none";
    lbImg.src = "";
    document.body.style.overflow = "";
  }, 380);
}

// clique fora da imagem fecha
lightbox.addEventListener("click", (e) => {
  if (e.target !== lbImg) closeLightbox();
});

// ESC também fecha
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// aplica em todas as fotos da galeria
document.querySelectorAll(".photo-grid img").forEach(img => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => openLightbox(img.src));
});