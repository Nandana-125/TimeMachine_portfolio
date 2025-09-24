// js/future.js

/* Back button */
document.getElementById("back-to-machine")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./index.html";
});

/* Scroll reveal */
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if ("IntersectionObserver" in window && !prefersReduced) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

/* 3D tilt on cards (subtle) */
document.querySelectorAll(".goal-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (prefersReduced) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = (y / r.height - 0.5) * -6; // rotateX
    const ry = (x / r.width - 0.5) * 6; // rotateY
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* Animated constellation grid on canvas (no libs) */
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d", { alpha: true });

let W = 0,
  H = 0,
  points = [];

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = canvas.width = Math.floor(innerWidth * dpr);
  H = canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildPoints();
}

function buildPoints() {
  points = [];
  const cols = Math.ceil(innerWidth / 120);
  const rows = Math.ceil(innerHeight / 120);
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      points.push({
        x: x * 120 + (Math.random() * 12 - 6),
        y: y * 120 + (Math.random() * 12 - 6),
        o: Math.random() * 0.6 + 0.2,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.6 + 0.4,
      });
    }
  }
}

function tick(t = 0) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // glow dots
  for (const pt of points) {
    const y = pt.y + Math.sin(t * 0.001 + pt.p) * 4 * pt.s;
    const x = pt.x + Math.cos(t * 0.001 + pt.p) * 4 * pt.s;

    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(33,230,255,${0.6 * pt.o})`;
    ctx.fill();

    // faint violet halo
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(176,107,255,${0.08 * pt.o})`;
    ctx.stroke();
  }

  // connect close neighbors
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const ax = a.x + Math.cos(t * 0.001 + a.p) * 4 * a.s;
    const ay = a.y + Math.sin(t * 0.001 + a.p) * 4 * a.s;

    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];
      const bx = b.x + Math.cos(t * 0.001 + b.p) * 4 * b.s;
      const by = b.y + Math.sin(t * 0.001 + b.p) * 4 * b.s;

      const dx = ax - bx,
        dy = ay - by;
      const d2 = dx * dx + dy * dy;
      if (d2 < 130 * 130) {
        const apha = 1 - Math.sqrt(d2) / 130;
        ctx.strokeStyle = `rgba(33,230,255,${0.08 * apha})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(tick);
}

resize();
addEventListener("resize", resize);
reque;
