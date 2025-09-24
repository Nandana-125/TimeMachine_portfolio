/* Back to main page */
document.getElementById("back-to-machine")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./index.html";
});

/* Scroll reveal (stone slab panels) */
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

/* ===================== MULTIPLE SPIDERS ===================== */
(function spawnSpiders() {
  const layer = document.getElementById("spider-layer");
  if (!layer) return;

  // Number of spiders
  const NUM_SPIDERS = 5;

  for (let i = 0; i < NUM_SPIDERS; i++) {
    makeSpider(layer);
  }

  function makeSpider(layer) {
    const SIZE = 36;
    const spider = document.createElement("div");
    spider.className = "spider";
    spider.style.position = "fixed";
    spider.style.width = `${SIZE}px`;
    spider.style.height = `${SIZE}px`;
    spider.style.pointerEvents = "none";
    spider.style.zIndex = "4";

    spider.innerHTML = `
      <svg viewBox="0 0 64 64" width="${SIZE}" height="${SIZE}" aria-hidden="true">
        <g fill="#000" stroke="#000" stroke-width="2" stroke-linecap="round">
          <!-- body -->
          <circle cx="32" cy="28" r="10"/>
          <circle cx="32" cy="42" r="8"/>

          <!-- legs -->
          <path class="leg l1" d="M26 23 Q18 18 10 14"/>
          <path class="leg l2" d="M26 27 Q17 26 8 24"/>
          <path class="leg l3" d="M26 31 Q17 34 10 38"/>
          <path class="leg l4" d="M28 37 Q20 42 12 50"/>
          <path class="leg r1" d="M38 23 Q46 18 54 14"/>
          <path class="leg r2" d="M38 27 Q47 26 56 24"/>
          <path class="leg r3" d="M38 31 Q47 34 54 38"/>
          <path class="leg r4" d="M36 37 Q44 42 52 50"/>
        </g>
      </svg>
    `;
    layer.appendChild(spider);

    // Wander state for this spider
    const state = {
      x: innerWidth * Math.random(),
      y: innerHeight * Math.random(),
      heading: Math.random() * Math.PI * 2,
      target: Math.random() * Math.PI * 2,
      speed: 60 + Math.random() * 80,
      lastChange: performance.now(),
      changeEvery: 1000 + Math.random() * 2000,
    };

    function pickNewTarget() {
      state.target = Math.random() * Math.PI * 2;
      state.speed = 50 + Math.random() * 90;
      state.changeEvery = 900 + Math.random() * 1800;
      state.lastChange = performance.now();
    }

    let lastT = performance.now();

    function step(now) {
      const dt = (now - lastT) / 1000;
      lastT = now;

      if (now - state.lastChange > state.changeEvery) pickNewTarget();

      // Smooth turning
      const MAX_TURN = 2.6;
      let diff = normalizeAngle(state.target - state.heading);
      const turn = Math.max(-MAX_TURN * dt, Math.min(MAX_TURN * dt, diff));
      state.heading = normalizeAngle(state.heading + turn);

      // Move
      state.x += Math.cos(state.heading) * state.speed * dt;
      state.y += Math.sin(state.heading) * state.speed * dt;

      // Bounce from edges
      const M = 24;
      if (
        state.x < M ||
        state.x > innerWidth - M ||
        state.y < M ||
        state.y > innerHeight - M
      ) {
        const tx = clamp(state.x, M, innerWidth - M) - state.x;
        const ty = clamp(state.y, M, innerHeight - M) - state.y;
        state.target = Math.atan2(ty, tx);
      }

      // Bobbing crawl
      const bob = Math.sin(now * 0.018) * 1.6;
      spider.style.transform = `translate(${state.x}px, ${state.y + bob}px) rotate(${(state.heading * 180) / Math.PI}deg)`;

      requestAnimationFrame(step);
    }

    // Leg animations (each spider gets different offsets)
    [...spider.querySelectorAll(".leg")].forEach((leg) => {
      leg.style.animationDelay = `${Math.random() * 300 - 150}ms`;
    });

    requestAnimationFrame(step);
  }

  // Helpers
  function normalizeAngle(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
})();
