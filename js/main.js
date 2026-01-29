// ==============================
// 1) Utils
// ==============================
function fixPathsForSubfolders() {
  // Si on est dans /articles/ ou autre sous-dossier,
  // on ajuste les liens/chemins du header injecté.
  const inSubfolder = location.pathname.split("/").length > 2 && !location.pathname.endsWith("/index.html");

  if (!inSubfolder) return;

  const header = document.querySelector(".topbar");
  if (!header) return;

  // liens
  header.querySelectorAll('a[href^="index.html"], a[href^="actus.html"], a[href^="equipes.html"], a[href^="calendrier.html"], a[href^="classement.html"]').forEach(a => {
    a.href = "../" + a.getAttribute("href");
  });

  // logo local
  header.querySelectorAll('img[src="logo-playground.png"]').forEach(img => {
    img.src = "../logo-playground.png";
  });
}

// ==============================
// 2) Injecter le header unique
// ==============================
async function injectHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  // On tente plusieurs chemins (root, sous-dossier, GH pages)
  const candidates = [
    "partials/banners.html",
    "../partials/banners.html",
    "/Playground/partials/banners.html"
  ];

  let html = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        html = await res.text();
        break;
      }
    } catch (e) {}
  }

  if (!html) {
    console.error("Impossible de charger partials/banners.html (chemin non trouvé).");
    return;
  }

  target.innerHTML = html;

  // Corriger chemins si on est dans /articles/
  fixPathsForSubfolders();

  // Une fois injecté → init du menu / recherche / bannières
  setActiveNav();
  initSearch();
  initMarquees();
}

// ==============================
// 3) Menu actif
// ==============================
function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": "actus",
    "actus.html": "actus",
    "equipes.html": "equipes",
    "calendrier.html": "calendrier",
    "classement.html": "classement",
    "article.html": "actus",
    "article-1.html": "actus"
  };

  const key = map[file];
  if (!key) return;

  document.querySelectorAll(".menu a").forEach(a => a.classList.remove("active"));

  const link = document.querySelector(`.menu a[data-nav="${key}"]`);
  if (link) link.classList.add("active");
}

// ==============================
// 4) Bouton recherche
// ==============================
function initSearch() {
  const btn = document.querySelector(".search-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const q = prompt("Rechercher une actu :");
    if (!q) return;

    // si on est dans /articles/, on renvoie vers ../actus.html
    const inSubfolder = location.pathname.includes("/articles/");
    const target = inSubfolder ? `../actus.html?q=${encodeURIComponent(q.trim())}`
                               : `actus.html?q=${encodeURIComponent(q.trim())}`;

    window.location.href = target;
  });
}

// ==============================
// 5) Marquee FIX (dots + copie stricte + boucle sans vide)
// ==============================
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
  };

  const setupMarquee = (marquee) => {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;

    const contents = Array.from(track.querySelectorAll(".marquee__content"));
    if (contents.length < 2) return;

    // A
    normalizeContent(contents[0]);

    // B = copie stricte
    contents[1].innerHTML = contents[0].innerHTML;

    // Distance EXACTE du bloc A
    const distance = contents[0].scrollWidth;

    const slow = track.classList.contains("marquee__track--slow");
    const speed = slow ? 55 : 75; // px/sec
    const duration = distance / speed;

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-duration", duration + "s");
  };

  document.querySelectorAll(".marquee").forEach(setupMarquee);
}

// ==============================
// 6) Background images via data-bg (si tu l'utilises)
// ==============================
document.querySelectorAll(".news[data-bg]").forEach((card) => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// ==============================
// Boot
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  injectHeader();

  // recalcul au resize (distance marquee)
  window.addEventListener("resize", () => {
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(() => {
      initMarquees();
    }, 150);
  });
});
