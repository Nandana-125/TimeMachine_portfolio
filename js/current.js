/* Back button */
const backBtn = document.getElementById("back-to-machine");
if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "./index.html";
  });
}

/**
 * Minimal ChatGPT-like renderer:
 * - messages[] holds the "conversation".
 * - renderMessages() injects them with small stagger + reveal.
 * - auto-scrolls to bottom as they appear.
 */

const chat = document.getElementById("chat");

const messages = [
  {
    role: "assistant",
    name: "TM", // Time Machine
    content:
      "Hey! You’re viewing Nandana's **Current** era. Here’s a live snapshot of what She's up to right now.",
  },
  {
    role: "user",
    name: "NP", // my initials
    content:
      "Give me a concise summary—studies, ongoing projects, internship hunt, and tools I’m using most.",
  },
  {
    role: "assistant",
    name: "TM",
    content: [
      "🎓 **Studies**: MS in Computer Science @ Northeastern University, Boston (in progress).",
      "💼 **Focus**: SWE + Data/AI; building portfolio projects and prepping for 2026 internships.",
      "🧪 **Current Projects**:",
      "• Pet Shelter App (React/Next.js + MySQL; encryption, admin/adopter roles).",
      "• Sign Language Detection (MediaPipe + TensorFlow; static/dynamic gestures).",
      "🔧 **Tools**: JS/TS, React, Node, Python, Java, MySQL, Tailwind; GitHub, VS Code; AWS basics.",
      "🚀 **Goals**: Polished demos, improve DSA patterns, and land a standout SWE internship.",
    ].join("\n"),
  },
  {
    role: "user",
    name: "NP",
    content:
      "What are the next 3 concrete tasks She wants to complete this week to move forward?",
  },
  {
    role: "assistant",
    name: "TM",
    content: [
      "1) **Polish a deploy**: Build Projects and finalize a public deploy + README + screenshots.",
      "2) **Interview reps**: 5 DSA problems across arrays/hash/graphs; summarize your patterns in a short note.",
    ].join("\n"),
  },
];

// Small helper to create a message DOM node
function createMessage({ role, name, content, time }) {
  const row = document.createElement("section");
  row.className = `msg ${role} reveal`;
  row.setAttribute("aria-label", `${role} message`);

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = (name || (role === "assistant" ? "TM" : "ME"))
    .slice(0, 2)
    .toUpperCase();

  const bubble = document.createElement("article");
  bubble.className = "bubble";
  bubble.innerHTML = content.replace(/\n/g, "<br>");

  const meta = document.createElement("div");
  meta.className = "meta";
  const stamp =
    time ||
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  meta.textContent = `${role === "assistant" ? "Assistant" : "You"} • ${stamp}`;

  const right = document.createElement("div");
  right.appendChild(bubble);
  right.appendChild(meta);

  row.appendChild(avatar);
  row.appendChild(right);
  return row;
}

// Reveal on insert
function revealWhenInView(el) {
  if (!("IntersectionObserver" in window)) {
    el.classList.add("visible");
    return;
  }
  const io = new IntersectionObserver(
    ([entry], obs) => {
      if (entry.isIntersecting) {
        el.classList.add("visible");
        obs.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  io.observe(el);
}

// Render with slight stagger for a chatty feel
async function renderMessages() {
  for (const msg of messages) {
    const node = createMessage(msg);
    chat.appendChild(node);
    revealWhenInView(node);
    chat.scrollTop = chat.scrollHeight;
    await new Promise((r) => setTimeout(r, 220));
  }
}

renderMessages();
