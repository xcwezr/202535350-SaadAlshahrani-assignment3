// ===== Settings =====
// Change this to your GitHub username so the GitHub section shows your repositories.
const GITHUB_USER = "xcwezr";

const $ = (id) => document.getElementById(id);

// localStorage can throw in private windows or when storage is blocked,
// so every read and write goes through these two helpers.
function load(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* the site still works, it just forgets */ }
}
function remove(key) {
  try { localStorage.removeItem(key); } catch (e) { /* nothing stored, nothing to remove */ }
}

// ===== Greeting =====
// Time of day, plus the visitor's name if they sent a message before.
// When a name is stored, a "Forget my name" button appears so the visitor can clear it.
function updateGreeting() {
  const hour = new Date().getHours();
  let text = "Good evening";
  if (hour < 12) text = "Good morning";
  else if (hour < 17) text = "Good afternoon";

  const visitor = load("visitorName");
  $("greeting").textContent = visitor ? `${text}, ${visitor}.` : `${text}.`;
  $("remembered").hidden = !visitor;
}
updateGreeting();

$("forgetMe").addEventListener("click", () => {
  remove("visitorName");
  updateGreeting();
});

// ===== Theme toggle =====
// The saved theme is already applied by the small script in <head>.
// If nothing is saved yet, follow the visitor's system setting.
const toggle = $("themeToggle");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let theme = load("theme") || (systemDark ? "dark" : "light");

function setTheme(next) {
  theme = next;
  document.documentElement.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "Light" : "Dark";
}
setTheme(theme);

toggle.addEventListener("click", () => {
  setTheme(theme === "dark" ? "light" : "dark");
  save("theme", theme);
});

// ===== Projects: filter, live search, sort, expand =====
const list = $("projectList");
const search = $("projectSearch");
const sortSelect = $("projectSort");
const chips = document.querySelectorAll(".chip");
const count = $("projectCount");
const empty = $("projectEmpty");

const FILTERS = [...chips].map((c) => c.dataset.filter); // ["all", "java", "web", "team"]
const dateValue = (p) => p.year * 12 + (p.month || 0); // months since year 0, so 2025-03 > 2025-01
const SORTS = {
    newest: { label: "newest first", compare: (a, b) => dateValue(b) - dateValue(a) || a.title.localeCompare(b.title) },
  oldest: { label: "oldest first", compare: (a, b) => dateValue(a) - dateValue(b) || a.title.localeCompare(b.title) },
  az: { label: "A to Z", compare: (a, b) => a.title.localeCompare(b.title) },
  za: { label: "Z to A", compare: (a, b) => b.title.localeCompare(a.title) }
};

// The chosen filter and sort are saved as one JSON object, so a returning visitor sees the
// list the way they left it. Stored values are checked against the allowed ones, because
// old or hand-edited data in localStorage must never break the page.
function loadView() {
  let saved = {};
  try { saved = JSON.parse(load("projectView")) || {}; } catch (e) { /* bad JSON, use defaults */ }
  return {
    filter: FILTERS.includes(saved.filter) ? saved.filter : "all",
    sort: Object.hasOwn(SORTS, saved.sort) ? saved.sort : "newest"
  };
}

const view = loadView();
let activeFilter = view.filter;
sortSelect.value = view.sort;
chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === activeFilter)));

function saveView() {
  save("projectView", JSON.stringify({ filter: activeFilter, sort: sortSelect.value }));
}

function projectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project";
  card.style.setProperty("--i", index); // used by the CSS entrance delay

  const detailsId = `details-${index}`;
  card.innerHTML = `
    <p class="year">${project.year}</p>
    <div>
      <h3></h3>
      <p class="summary"></p>
      <p class="meta"></p>
      <button type="button" class="more" aria-expanded="false" aria-controls="${detailsId}">Show details</button>
      <div class="details" id="${detailsId}">
        <div class="details-inner">
          <p class="role"></p>
          <img width="640" height="360" loading="lazy" />
        </div>
      </div>
    </div>`;

  // Text goes in through textContent, never as HTML
  card.querySelector("h3").textContent = project.title;
  card.querySelector(".summary").textContent = project.summary;
  card.querySelector(".meta").textContent = project.stack;
  card.querySelector(".role").textContent = project.role;
  const img = card.querySelector("img");
  img.src = project.image;
  img.alt = project.alt;

  const button = card.querySelector(".more");
  button.addEventListener("click", () => {
    const open = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Hide details" : "Show details";
  });

  return card;
}

function matches(project, query) {
  const text = [project.title, project.summary, project.stack, project.tags.join(" ")]
    .join(" ")
    .toLowerCase();
  return text.includes(query);
}

// Builds the line above the list from the current choices,
// e.g. 'Showing 2 of 4 team projects matching "java", newest first'.
function describeView(shownCount, query) {
  const type = activeFilter === "all" ? "" : `${activeFilter} `;
  const match = query ? ` matching "${query}"` : "";
  return `Showing ${shownCount} of ${PROJECTS.length} ${type}projects${match}, ${SORTS[sortSelect.value].label}`;
}

// Three steps, always in this order: filter by type, then by search text, then sort.
// .sort() runs on the filtered copy, so the original PROJECTS order is never changed.
function renderProjects() {
  const query = search.value.trim().toLowerCase();
  const shown = PROJECTS
    .filter((p) => activeFilter === "all" || p.tags.includes(activeFilter))
    .filter((p) => matches(p, query))
    .sort(SORTS[sortSelect.value].compare);

  list.replaceChildren(...shown.map(projectCard));
  empty.hidden = shown.length > 0;
  count.textContent = describeView(shown.length, query);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    saveView();
    renderProjects();
  });
});

sortSelect.addEventListener("change", () => {
  saveView();
  renderProjects();
});

search.addEventListener("input", renderProjects);

$("clearFilters").addEventListener("click", () => {
  search.value = "";
  chips[0].click(); // "All" re-renders the list
  search.focus();
});

renderProjects();

// ===== GitHub repositories from the public API =====
const repoState = $("repoState");
const repoList = $("repoList");

function showState(message, withRetry) {
  repoState.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = message;
  repoState.append(p);

  if (withRetry) {
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try again";
    retry.addEventListener("click", loadRepos);
    repoState.append(retry);
  }
}

async function loadRepos() {
  repoList.innerHTML = "";

  if (GITHUB_USER === "your-username") {
    showState("Add a GitHub username in js/script.js to show repositories here.", false);
    return;
  }

  repoState.innerHTML = '<p class="loading"><span class="spinner" aria-hidden="true"></span>Loading repositories…</p>';

  // Give up after 8 seconds rather than leaving the visitor waiting
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?sort=updated&per_page=6`,
      { signal: controller.signal }
    );

    if (response.status === 404) throw new Error("That GitHub user was not found.");
    if (response.status === 403) throw new Error("GitHub is limiting requests right now. Please try again in a few minutes.");
    if (!response.ok) throw new Error("GitHub did not respond as expected.");

    const repos = (await response.json()).filter((r) => !r.fork);

    if (repos.length === 0) {
      showState("No public repositories yet. Check back soon.", false);
      return;
    }

    repoState.innerHTML = "";
    repos.forEach((repo) => {
      const li = document.createElement("li");
      li.className = "repo";

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.textContent = repo.name;
      link.target = "_blank";
      link.rel = "noopener";

      const desc = document.createElement("p");
      desc.textContent = repo.description || "No description.";

      const meta = document.createElement("p");
      meta.className = "meta";
      const updated = new Date(repo.updated_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      });
      meta.textContent = `${repo.language || "Mixed"} · updated ${updated}`;

      li.append(link, desc, meta);
      repoList.append(li);
    });
  } catch (error) {
    const message =
      error.name === "AbortError"
        ? "GitHub is taking too long to answer. Check your connection and try again."
        : error.message === "Failed to fetch"
          ? "Could not reach GitHub. Check your connection and try again."
          : error.message;
    showState(message, true);
  } finally {
    clearTimeout(timer);
  }
}

loadRepos();

// ===== Contact form =====
// Each field is checked on its own and gets its own message.
const form = $("contactForm");
const status = $("formStatus");
const message = $("message");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rules = {
  name: (v) => (v ? "" : "Please enter your name."),
  email: (v) =>
    !v ? "Please enter your email." : EMAIL_PATTERN.test(v) ? "" : "That email looks incomplete, for example name@example.com.",
  message: (v) =>
    !v ? "Please write a message." : v.length < 10 ? "Please write at least 10 characters." : ""
};

function checkField(id) {
  const input = $(id);
  const error = rules[id](input.value.trim());
  $(`${id}-error`).textContent = error;
  input.setAttribute("aria-invalid", error ? "true" : "false");
  return !error;
}

// Re-check a field as the visitor fixes it, but only once it has been flagged
Object.keys(rules).forEach((id) => {
  $(id).addEventListener("input", () => {
    if ($(id).getAttribute("aria-invalid") === "true") checkField(id);
  });
});

message.addEventListener("input", () => {
  $("messageCount").textContent = `${message.value.length} / 500`;
});

function showStatus(text, kind) {
  status.textContent = text;
  status.className = `status ${kind}`;
  // Restart the animation even if the same message appears twice
  void status.offsetWidth;
  status.classList.add("show");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = Object.keys(rules).map(checkField);
  if (results.includes(false)) {
    showStatus("Please fix the highlighted fields.", "bad");
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const name = $("name").value.trim();
  save("visitorName", name.split(" ")[0]);
  updateGreeting();

  showStatus(`Thanks ${name}, your message has been received.`, "good");
  form.reset();
  $("messageCount").textContent = "0 / 500";
  Object.keys(rules).forEach((id) => $(id).removeAttribute("aria-invalid"));
});

// ===== Fade sections in as they scroll into view =====
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

// ===== Visit counter and time on page =====
// The counter goes up once per page load and is stored, so it survives reloads.
// The timer only counts while the tab is visible: switching tabs pauses it,
// coming back resumes it, so it measures time actually spent on the page.
const visitInfo = $("visitInfo");
const visits = (parseInt(load("visitCount"), 10) || 0) + 1;
save("visitCount", String(visits));

let activeMs = 0;              // time counted in earlier visible stretches
let visibleSince = document.hidden ? null : Date.now(); // start of the current visible stretch, or null while hidden

function formatDuration(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

function updateVisitInfo() {
  const now = visibleSince === null ? activeMs : activeMs + (Date.now() - visibleSince);
  const visitText = visits === 1 ? "First visit" : `Visit ${visits}`;
  visitInfo.textContent = `${visitText} · ${formatDuration(now)} on this page`;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    activeMs += Date.now() - visibleSince;
    visibleSince = null;
  } else {
    visibleSince = Date.now();
    updateVisitInfo();
  }
});

updateVisitInfo();
setInterval(() => {
  if (visibleSince !== null) updateVisitInfo(); // no work while the tab is hidden
}, 1000);

$("year").textContent = "© " + new Date().getFullYear() + " Saad Alshahrani";
