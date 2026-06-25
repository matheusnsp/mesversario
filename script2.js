// ─── CONTADOR (tempo juntos, contínuo desde o início) ───
const inicio2 = new Date(2025, 4, 24);
function updateTimer2() {
  const agora = new Date();
  const diff = agora - inicio2;
  const totalDias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const meses = Math.floor(totalDias / 30);
  const diasRestantes = totalDias % 30;
  const elMeses = document.getElementById('c2-meses');
  const elDias  = document.getElementById('c2-dias');
  if (elMeses) elMeses.textContent = meses;
  if (elDias)  elDias.textContent  = diasRestantes;
}
updateTimer2();
setInterval(updateTimer2, 60000);

// ─── CÉU ESTRELADO + ESTRELAS CADENTES ───
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let W, H, stars = [], shootingStars = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 130; i++) {
  stars.push({
    x: Math.random() * 1600,
    y: Math.random() * 1600,
    r: 0.5 + Math.random() * 1.4,
    base: 0.25 + Math.random() * 0.55,
    speed: 0.5 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2
  });
}

function maybeSpawnShootingStar() {
  if (Math.random() < 0.4) {
    shootingStars.push({
      x: Math.random() * W * 0.7 + W * 0.15,
      y: Math.random() * H * 0.35,
      vx: -(3 + Math.random() * 2.5),
      vy: 1.6 + Math.random() * 1.4,
      life: 1
    });
  }
  setTimeout(maybeSpawnShootingStar, 4500 + Math.random() * 6000);
}
setTimeout(maybeSpawnShootingStar, 3000);

let t = 0;
let lastFrame = 0;
const TARGET_FPS = 40;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function drawSky(now) {
  requestAnimationFrame(drawSky);
  if (now - lastFrame < FRAME_INTERVAL) return;
  lastFrame = now;

  t += 0.022;
  ctx.clearRect(0, 0, W, H);

  // estrelas fixas, tremulando
  ctx.fillStyle = '#f3ecd9';
  stars.forEach(s => {
    const alpha = s.base + Math.sin(t * s.speed + s.phase) * 0.22;
    ctx.globalAlpha = Math.max(alpha, 0.05);
    ctx.beginPath();
    ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // estrelas cadentes
  if (shootingStars.length > 0) {
    ctx.globalAlpha = 1;
    shootingStars = shootingStars.filter(sh => sh.life > 0 && sh.x > -50 && sh.y < H + 50);
    shootingStars.forEach(sh => {
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 14, sh.y - sh.vy * 14);
      grad.addColorStop(0, `rgba(217,176,106,${sh.life})`);
      grad.addColorStop(1, 'rgba(217,176,106,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 14, sh.y - sh.vy * 14);
      ctx.stroke();
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.018;
    });
  }
}
requestAnimationFrame(drawSky);

// ─── FIO CENTRAL (cresce só até a seção "O que eu amo") ───
const threadFill = document.getElementById('thread-fill');
const threadEl   = document.querySelector('.thread');
const starlist   = document.querySelector('.starlist');

function updateThread() {
  if (!threadFill || !threadEl || !starlist) return;
  // Define a altura do container do fio para que ele termine no final da starlist
  const contentTop = document.querySelector('.content2').getBoundingClientRect().top + window.scrollY;
  const starlistBottom = starlist.getBoundingClientRect().bottom + window.scrollY;
  const threadHeight = starlistBottom - contentTop;
  threadEl.style.height = threadHeight + 'px';

  // Progresso do preenchimento
  const scrolled = window.scrollY + window.innerHeight * 0.55 - contentTop;
  const progress = Math.min(Math.max(scrolled / threadHeight, 0), 1);
  threadFill.style.height = (progress * 100) + '%';
}
window.addEventListener('scroll', updateThread, { passive: true });
window.addEventListener('resize', updateThread);
updateThread();

// ─── SCROLL REVEAL ───
const reveals2 = document.querySelectorAll('.reveal2');
const observer2 = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer2.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals2.forEach(r => observer2.observe(r));

// ─── SANFONA DAS CARTAS MENSAIS ───
document.querySelectorAll('.month-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const node = btn.closest('.month-node');
    const body = node.querySelector('.month-body');
    const isOpen = node.classList.contains('open');
    if (isOpen) {
      body.style.maxHeight = '0px';
      node.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      body.style.maxHeight = body.scrollHeight + 'px';
      node.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.month-node.open .month-body').forEach(body => {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
});

// ─── LIGHTBOX (foto abre ao clicar) ───
const lightbox2 = document.createElement('div');
lightbox2.id = 'lightbox2';
lightbox2.style.cssText = `
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(6,10,22,0);
  backdrop-filter: blur(0px);
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
  transition: background 0.35s ease, backdrop-filter 0.35s ease;
`;
lightbox2.innerHTML = `
  <img id="lightbox2-img" src="" alt="" style="
    max-width: 90vw;
    max-height: 88vh;
    border-radius: 6px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7);
    transform: scale(0.88);
    opacity: 0;
    transition: transform 0.38s cubic-bezier(.23,1,.32,1), opacity 0.38s ease;
  ">
`;
document.body.appendChild(lightbox2);
const lbImg2 = document.getElementById('lightbox2-img');

function openLightbox2(src) {
  lbImg2.src = src;
  lightbox2.style.display = 'flex';
  lightbox2.offsetHeight;
  lightbox2.style.background = 'rgba(6,10,22,0.92)';
  lightbox2.style.backdropFilter = 'blur(12px)';
  lbImg2.style.transform = 'scale(1)';
  lbImg2.style.opacity = '1';
  document.body.style.overflow = 'hidden';
}

function closeLightbox2() {
  lightbox2.style.background = 'rgba(6,10,22,0)';
  lightbox2.style.backdropFilter = 'blur(0px)';
  lbImg2.style.transform = 'scale(0.88)';
  lbImg2.style.opacity = '0';
  setTimeout(() => {
    lightbox2.style.display = 'none';
    lbImg2.src = '';
    document.body.style.overflow = '';
  }, 380);
}

lightbox2.addEventListener('click', (e) => {
  if (e.target !== lbImg2) closeLightbox2();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox2();
});

document.querySelectorAll('.polaroid img').forEach(img => {
  img.addEventListener('click', () => openLightbox2(img.src));
});