const GH_API = "https://api.github.com/users/Hanamanthkuri/repos?per_page=100&sort=updated";
const GH_CACHE = "gh-repos-v1";

async function fetchRepos() {
  try { const c = JSON.parse(sessionStorage.getItem(GH_CACHE)); if (c && Date.now() - c.t < 6e5) return c.data; } catch (e) {}
  const res = await fetch(GH_API, { headers: { Accept: "application/vnd.github+json" } });
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset ? new Date(+reset * 1000).toLocaleTimeString() : "a little later";
    throw new Error(`GitHub's request limit was reached. Try again after ${when}.`);
  }
  if (!res.ok) throw new Error(`GitHub returned an error (${res.status}).`);
  const data = await res.json();
  try { sessionStorage.setItem(GH_CACHE, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
  return data;
}

function renderGithub(repos) {
  const own = repos.filter(r => !r.fork);
  const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
  const forks = own.reduce((n, r) => n + r.forks_count, 0);
  const langs = {}; own.forEach(r => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
  document.getElementById("ghStats").innerHTML =
    [[own.length, "public repositories"], [stars, "stars"], [forks, "forks"]].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");
  document.getElementById("ghLangs").innerHTML = Object.entries(langs).sort((a, b) => b[1] - a[1])
    .map(([l, n]) => `<span class="tag">${esc(l)} · ${n}</span>`).join("") || `<span class="muted">No language data.</span>`;
  document.getElementById("ghRecent").innerHTML = own.slice(0, 6).map(r => `
    <li><a href="${esc(r.html_url)}" target="_blank" rel="noopener"><b>${esc(r.name)}</b></a>
    <span class="muted">${esc(r.language || "–")} · ★ ${r.stargazers_count} · ⑂ ${r.forks_count} · updated ${new Date(r.pushed_at).toLocaleDateString()}</span></li>`).join("");
  document.getElementById("ghStatus").hidden = true;
  document.getElementById("ghBody").hidden = false;
  window.animateCount && animateCount(document.getElementById("cRepos"), own.length);
}

async function loadGithub() {
  const status = document.getElementById("ghStatus");
  status.hidden = false; status.textContent = "Loading repositories…";
  try { const repos = await fetchRepos(); renderGithub(repos); addRepos(repos); }
  catch (err) {
    status.innerHTML = `${esc(err.message || "Could not reach GitHub.")} <button class="btn" id="ghRetry">Retry</button>`;
    document.getElementById("ghRetry").onclick = loadGithub;
  }
}
document.addEventListener("DOMContentLoaded", loadGithub);
