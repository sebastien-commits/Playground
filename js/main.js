// -----------------------------
// Helpers
// -----------------------------
const isInArticlesFolder = () => location.pathname.includes("/articles/");
const BASE = isInArticlesFolder() ? ".." : ".";

// -----------------------------
// Injecte le partial banners.html
// -----------------------------
async function injectBanners() {
  const target = document.querySelector("[data-banners]");
  if (!target) return;

  const url = `${BASE}/partials/banners.html`;
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    console.warn("Impossible de charger", url, res.status);
    return;
  }

  let html = await res.text();
  html = html.replaceAll("{{BASE}}", BASE);

  target.innerHTML = html;
}

// -----------------------------
// Menu actif automatiquement
// -----------------------------
function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": "actus",
    "actus.html": "actus",
    "equipes.html": "equipes",
    "calendrier.html": "calendrier",
    "classement.html": "classement",
  };
  const key = map[file];
  if (!key) return;

  const link = document.querySelector(`.menu a[data-nav="${key}"]`);
  if (link) link.classList.add("active");
}

// -----------------------------
// Recherche (loupe)
// -----------------------------
function bindSearch() {
  const btn = document.querySelector(".search-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const q = prompt("Rechercher une actu :");
    if (!q) return;

    // On va toujours vers actus.html, en respectant BASE (articles vs racine)
    window.location.href = `${BASE}/actus.html?q=${encodeURIComponent(q.trim())}`;
  });
}

// -----------------------------
// Marquee : dots propres + copie stricte + distance exacte (zéro trou)
// -----------------------------
function initMarquees() {
  const makeDot = () => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.innerHTML = "&nbsp;•&nbsp;";
    return dot;
  };

  const normalizeContent = (content) => {
    const items = Array.from(content.querySelectorAll(".item"));
    if (!items.length) return;

    content.replaceChildren();
    items.forEach((item, idx) => {
      if (idx > 0) content.appendChild(makeDot());
      content.appendChild(item.cloneNode(true));
    });
    // PAS de dot à la fin -> la duplication fait le raccord
  };

  document.querySelectorAll(".marquee").forEach((marquee) => {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;

    const contents = Array.from(track.querySelectorAll(".marquee__content"));
    if (contents.length < 2) return;

    // A
    normalizeContent(contents[0]);

    // B = copie stricte de A
    for (let i = 1; i < contents.length; i++) {
      contents[i].innerHTML = contents[0].innerHTML;
    }

    // distance exacte = largeur de A (après images chargées)
    const distance = contents[0].scrollWidth;

    const slow = track.classList.contains("marquee__track--slow");
    const speed = slow ? 55 : 75; // px/s
    const duration = distance / speed;

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-duration", duration + "s");
  });
}

// -----------------------------
// Background images via data-bg (si tu utilises data-bg sur tes cards)
// -----------------------------
function initCardBackgrounds() {
  document.querySelectorAll(".news[data-bg]").forEach((card) => {
    const url = card.getAttribute("data-bg");
    if (url) card.style.backgroundImage = `url('${url}')`;
  });
}

// -----------------------------
// Boot
// -----------------------------
(async function boot() {
  // 1) Injecte d'abord les bannières (sinon on bind sur du vide)
  await injectBanners();

  // 2) Puis initialise tout ce qui dépend du header
  setActiveNav();
  bindSearch();

  // 3) Marquees : après load (logos)
  window.addEventListener("load", initMarquees);

  // 4) Recalc au resize
  window.addEventListener("resize", () => {
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(initMarquees, 150);
  });

  // 5) Autres init
  initCardBackgrounds();
})();
