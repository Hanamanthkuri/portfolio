// Curated projects come from the resume. Extra GitHub repos are added by github.js.
const GH_PROFILE = "https://github.com/Hanamanthkuri";
const CATEGORIES = ["All", "Java", "Spring Boot", "Frontend", "Full Stack", "Python"];
const PROJECTS = [
  { title: "Banking Web Application", match: /bank/i, cats: ["Java", "Spring Boot", "Full Stack"],
    tech: ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "MySQL", "Thymeleaf", "Spring Security"],
    desc: "A banking web application built with Java, Spring Boot and MySQL, with server-rendered pages and Spring Security for authentication.",
    features: ["User registration and login", "Dashboard", "Deposits and withdrawals", "Money transfers", "Transaction history", "JPA and Hibernate database integration with MySQL"] },
  { title: "AgriInnovators – Smart Agriculture Platform", match: /agri/i, cats: ["Frontend", "Full Stack"],
    tech: ["Next.js", "React", "TypeScript", "Supabase", "Google Generative AI", "Leaflet", "Tailwind CSS"],
    desc: "A full-stack smart agriculture platform that supports interaction between farmers and agricultural experts.",
    features: ["Farmer and agricultural expert interaction", "Data management and authentication with Supabase", "AI-powered features using Google Generative AI", "Interactive maps with Leaflet", "Responsive interface"] },
  { title: "E-Learning Web Application", match: /learn/i, cats: ["Frontend"],
    tech: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    desc: "A responsive e-learning web application for course exploration and student interaction, running entirely in the browser.",
    features: ["Registration and login", "Course browsing and enrollment", "Profile management", "Form validation", "LocalStorage data persistence"] },
];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let allProjects = PROJECTS.map(p => ({ ...p, url: GH_PROFILE + "?tab=repositories", source: "resume" }));
let activeCat = "All";
const initials = t => t.split(/[\s–-]+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  const list = allProjects.filter(p => activeCat === "All" || p.cats.includes(activeCat));
  grid.innerHTML = list.length ? list.map((p, i) => `
    <article class="glass card">
      <div class="thumb" aria-hidden="true">${esc(initials(p.title))}</div>
      <div class="body">
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <div class="tags">${p.tech.slice(0, 5).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="btns"><button class="btn" data-i="${allProjects.indexOf(p)}">Details</button>
        <a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">GitHub</a></div>
      </div></article>`).join("") : `<p class="muted">No projects in this category yet.</p>`;
}
function renderFilters() {
  const f = document.getElementById("filters");
  f.innerHTML = CATEGORIES.map(c => `<button data-c="${c}" aria-pressed="${c === activeCat}">${c}</button>`).join("");
  f.onclick = e => { const b = e.target.closest("button"); if (!b) return; activeCat = b.dataset.c; renderFilters(); renderProjects(); };
}
function openModal(p) {
  document.getElementById("mTitle").textContent = p.title;
  document.getElementById("mDesc").textContent = p.desc;
  document.getElementById("mFeat").innerHTML = (p.features || ["See the repository for details."]).map(f => `<li>${esc(f)}</li>`).join("");
  document.getElementById("mTags").innerHTML = p.tech.map(t => `<span class="tag">${esc(t)}</span>`).join("");
  document.getElementById("mLink").href = p.url;
  const m = document.getElementById("modal"); m.hidden = false; document.getElementById("mClose").focus();
}
function closeModal() { document.getElementById("modal").hidden = true; }

// Called by github.js with the live repo list.
function addRepos(repos) {
  allProjects.forEach(p => { const r = repos.find(r => p.match.test(r.name)); if (r) { p.url = r.html_url; p.repoFound = true; } });
  const known = allProjects.filter(p => p.repoFound).map(p => p.url);
  repos.filter(r => !r.fork && r.name.toLowerCase() !== "hanamanthkuri" && !known.includes(r.html_url)).forEach(r => {
    const lang = r.language || "", cats = [];
    if (lang === "Java") cats.push("Java");
    if (lang === "Python") cats.push("Python");
    if (["JavaScript", "HTML", "CSS", "TypeScript"].includes(lang)) cats.push("Frontend");
    allProjects.push({ title: r.name.replace(/[-_]/g, " "), cats, tech: lang ? [lang] : ["See repository"],
      desc: r.description || "Repository on GitHub. No description has been added yet.", url: r.html_url, source: "github" });
  });
  renderProjects();
}
document.addEventListener("DOMContentLoaded", () => {
  renderFilters(); renderProjects();
  document.getElementById("projectGrid").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) openModal(allProjects[+b.dataset.i]); });
  document.getElementById("mClose").onclick = closeModal;
  document.getElementById("modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
