// js/discovery.js

/* Back button */
document.getElementById("back-to-machine")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./index.html";
});

/* Neon cursor for retro theme  */
const cursor = document.getElementById("retro-cursor");
cursor.innerHTML = `
  <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
    <path fill="#e6e6e6" d="M2 2 L2 22 L7 17 L10 27 L13 26 L10 16 L16 16 Z"/>
    <path fill="#00ffd5" d="M10 27 L12 21 L13 26 Z" opacity="0.95"/>
    <path fill="none" stroke="#000" stroke-width="1"
          d="M2 2 L2 22 L7 17 L10 27 L13 26 L10 16 L16 16 Z"/>
  </svg>
`;
let raf;
window.addEventListener("mousemove", (e) => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
});

/* Simple  particle layer (no libraries) */
const stars = document.getElementById("stars");
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const STAR_COUNT = prefersReduced ? 40 : 90;

function makeStar() {
  const s = document.createElement("span");
  const size = Math.random() * 2 + 1; // 1..3px
  s.style.position = "absolute";
  s.style.width = `${size}px`;
  s.style.height = `${size}px`;
  s.style.borderRadius = "50%";
  s.style.background =
    Math.random() < 0.6 ? "rgba(0,255,213,.8)" : "rgba(255,71,163,.8)";
  s.style.left = `${Math.random() * 100}%`;
  s.style.top = `${Math.random() * 100}%`;
  s.style.opacity = Math.random() * 0.9 + 0.1;
  s.style.filter = "blur(0.5px)";
  stars.appendChild(s);

  if (!prefersReduced) {
    const dx = (Math.random() - 0.5) * 0.6; // slow movement
    const dy = (Math.random() - 0.5) * 0.6;
    let x = parseFloat(s.style.left);
    let y = parseFloat(s.style.top);

    function drift() {
      x += dx * 0.04;
      y += dy * 0.04;
      if (x < 0) x = 100;
      if (x > 100) x = 0;
      if (y < 0) y = 100;
      if (y > 100) y = 0;
      s.style.left = `${x}%`;
      s.style.top = `${y}%`;
      requestAnimationFrame(drift);
    }
    requestAnimationFrame(drift);
  }
}
for (let i = 0; i < STAR_COUNT; i++) makeStar();

document.querySelectorAll(".disc").forEach((card) => {
  card.setAttribute("tabindex", "0");
});
