const $ = s => document.querySelector(s);
const SKILLS = {
  Programming: [["Java", "devicon-java-plain"], ["SQL", "devicon-azuresqldatabase-plain"], ["JavaScript", "devicon-javascript-plain"]],
  Backend: [["Spring"], ["Spring Boot", "devicon-spring-plain"], ["Spring MVC"], ["REST APIs"], ["JDBC"], ["CRUD Operations"], ["JSON", "devicon-json-plain"]],
  "Java Technologies": [["Spring Data JPA"], ["Hibernate", "devicon-hibernate-plain"], ["Collections"], ["Exception Handling"], ["Java 8 Features"]],
  Frontend: [["HTML", "devicon-html5-plain"], ["CSS", "devicon-css3-plain"], ["JavaScript", "devicon-javascript-plain"], ["React", "devicon-react-original"], ["Next.js", "devicon-nextjs-plain"], ["TypeScript", "devicon-typescript-plain"]],
  Database: [["MySQL", "devicon-mysql-plain"], ["SQL"], ["Database Integration"], ["Joins"]],
  Tools: [["IntelliJ IDEA", "devicon-intellij-plain"], ["VS Code", "devicon-vscode-plain"], ["Git", "devicon-git-plain"], ["GitHub", "devicon-github-original"], ["Maven", "devicon-maven-plain"], ["Postman", "devicon-postman-plain"]],
  Fundamentals: [["OOP"], ["DSA"], ["DBMS"], ["MVC Architecture"], ["SDLC"]],
};
window.animateCount = (el, to) => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = to; return; }
  const t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 900, 1); el.textContent = Math.round(to * p); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  // skills
  $("#skillGrid").innerHTML = Object.entries(SKILLS).map(([g, items]) => `
    <article class="glass skill"><h3>${g}</h3><div class="tags">${items.map(([n, i]) => `<span class="tag">${i ? `<i class="${i} colored"></i>` : ""}${n}</span>`).join("")}</div></article>`).join("");
  // theme
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#themeBtn").onclick = () => { root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {} };
  // typing
  const words = ["Java Developer", "Spring Boot Developer", "Backend Developer", "Full Stack Developer"], el = $("#typed");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) el.textContent = words[0];
  else { let w = 0, c = 0, del = false;
    (function tick() { const word = words[w]; c += del ? -1 : 1; el.textContent = word.slice(0, c);
      let d = del ? 40 : 90; if (!del && c === word.length) { del = true; d = 1400; } else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
      setTimeout(tick, d); })(); }
  // nav
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), top = $("#topBtn");
  addEventListener("scroll", () => { nav.classList.toggle("stuck", scrollY > 20); top.hidden = scrollY < 500; }, { passive: true });
  burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
  top.onclick = () => scrollTo({ top: 0 });
  const links = [...menu.querySelectorAll("a")];
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
  // reveal
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { threshold: .08 });
  document.querySelectorAll(".reveal").forEach(s => rv.observe(s));
  // form
  const f = $("#form");
  const rules = { fName: v => v.trim().length >= 2 || "Enter your name.", fEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
    fSubject: v => v.trim().length >= 3 || "Enter a subject.", fMsg: v => v.trim().length >= 10 || "Write at least 10 characters." };
  const check = id => { const i = $("#" + id), r = rules[id](i.value); i.setAttribute("aria-invalid", r !== true); i.parentElement.querySelector(".err").textContent = r === true ? "" : r; return r === true; };
  Object.keys(rules).forEach(id => $("#" + id).addEventListener("blur", () => check(id)));
  f.addEventListener("submit", e => { e.preventDefault();
    if (!Object.keys(rules).map(check).every(Boolean)) return;
    const body = `${$("#fMsg").value}\n\nFrom: ${$("#fName").value} (${$("#fEmail").value})`;
    location.href = `mailto:hanamanthkuri18@gmail.com?subject=${encodeURIComponent($("#fSubject").value)}&body=${encodeURIComponent(body)}`;
    $("#formNote").textContent = "Your email app should open now. If it doesn't, write to hanamanthkuri18@gmail.com directly."; });
});
