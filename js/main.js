// main.js 
// your code exhibits great modularity! your functions are well separated and keeps your code readable and easily maintainable! 
// also good implementation of ES6 features like arrow functions, const/let and optional chaining! 
// the dial interaction is currently only mouse based and could cause issues in a mobile environment. I would consider adding things like touch events 
const dial = document.getElementById("dial");
const eraDisplay = document.getElementById("eraDisplay").querySelector("span");
const ringNav = document.getElementById("ringNav");
const ringItems = Array.from(document.querySelectorAll(".ring-item"));
const imgEl = document.querySelector(".machine-img");

let currentAngle = 0;
let isDragging = false;

// Clockwise order: right(0°) → bottom(90°) → left(180°) → top(270°)
const headings = ["Future", "Age of Discovery", "Current", "Ancient Past"];
const labelAngles = [0, 90, 180, 270];
let selected = "Current";

/* --------- size the ring to wrap the image & place labels ---------- */
function positionRingItems() {
  if (!ringNav || !imgEl) return;

  const rect = imgEl.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  // pad outside the image so the ring doesn’t overlap the glow
  const pad = 48;
  const size = Math.ceil(Math.max(rect.width, rect.height) + pad);

  ringNav.style.width = `${size}px`;
  ringNav.style.height = `${size}px`;

  const r = size / 2;
  ringItems.forEach((el, i) => {
    const rad = (labelAngles[i] * Math.PI) / 180;
    const inner = r - 10; // nudge inside the border
    const x = r + inner * Math.cos(rad);
    const y = r + inner * Math.sin(rad);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = headings[i].toUpperCase();
  });
}
// your typewriter and subtext effects here have nearly identical code. I think you could abstract these into a single function! 
/* Recompute when image is ready and on resize */
function readyPositioning() {
  // If the image is already cached/loaded, position immediately
  if (imgEl.complete && imgEl.naturalWidth > 0) {
    positionRingItems();
  } else {
    imgEl.addEventListener("load", positionRingItems, { once: true });
  }
}
window.addEventListener("load", readyPositioning);
window.addEventListener("resize", positionRingItems);

/* -------------------- dial rotating  -------------------- */
dial.addEventListener("mousedown", () => (isDragging = true));
document.addEventListener("mouseup", () => (isDragging = false));

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = dial.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
  currentAngle = ((angle % 360) + 360) % 360; // normalize 0..360

  dial.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
  syncHighlight(currentAngle);
});

/* -------------------- click a label to rotate dial -------------------- */
ringItems.forEach((item, i) => {
  item.addEventListener("click", () => {
    const targetAngle = ((labelAngles[i] % 360) + 360) % 360;
    currentAngle = targetAngle;
    dial.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg)`;
    syncHighlight(targetAngle);
  });
});

/* ------------- map dial angle to one of 4 90° sectors -------------- */
function syncHighlight(angleDeg) {
  const sector = Math.floor(angleDeg / 90) % 4;
  ringItems.forEach((el, idx) => el.classList.toggle("active", idx === sector));
  selected = headings[sector];
  eraDisplay.textContent = selected;
}

/* ------------------- Enter btn behavior ------------------- */
document.querySelector(".enter-btn").addEventListener("click", () => {
  if (selected === "Ancient Past") {
    window.location.href = "./ancient.html"; // 👈 go to your Ancient page
  } else if (selected === "Future") {
    window.location.href = "./future.html"; // example for future pages
  } else if (selected === "Age of Discovery") {
    window.location.href = "./age-of-discovery.html";
  } else if (selected === "Current") {
    window.location.href = "./current.html";
  } else {
    alert(`Entering the ${selected} era...`);
  }
});

// initial state
syncHighlight(0);

/* Typewriter effect */
const typewriterEl = document.getElementById("typewriter");
if (typewriterEl) {
  const text = "Hi, I am Nandana";
  let i = 0;

  function type() {
    if (i < text.length) {
      typewriterEl.textContent += text.charAt(i);
      i++;
      setTimeout(type, 120); // typing speed (ms per char)
    }
  }

  // Start typing after short delay
  setTimeout(type, 600);
}

/* subtext effect */
const subtextEl = document.getElementById("subtext");
if (typewriterEl) {
  const text = "Rotate the dial and click enter ";
  let i = 0;

  function type() {
    if (i < text.length) {
      subtextEl.textContent += text.charAt(i);
      i++;
      setTimeout(type, 120); // typing speed (ms per char)
    }
  }

  // Start typing after short delay
  setTimeout(type, 650);
}

/* Smooth-scroll for in-page nav (About, How it works, Contact) */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
