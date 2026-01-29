// ===============================
// Playground - main.js
// ===============================

// Background images via data-bg (si tu utilises des cards en data-bg)
document.querySelectorAll(".news[data-bg]").forEach((card) => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// Menu actif automatiquement selon la page
(function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": "actus", // accueil = actus
    "actus.html": "actus",
    "equipes.html": "equipes",
    "calendrier.html": "calendrier",
    "classement.html": "classement",
  };
  const key = map[file];
  if (!key) return;

  const link = document.querySelector(`.menu a[data-nav="${key}"]`);
  if (link) link.classList.add("active");
})();

// Recherche (loupe)
(function searchPrompt() {
  const btn = document.querySelector(".search-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const q = prompt("Rechercher une actu :");
    if (!q) return;
    window.location.href = `actus.html?q=${encodeURIComponent(q.trim())}`;
  });
})();

/* =========================================================
   BANNERS PARTIAL + MARQUEE FIX (points + loop sans vide)
   - injecte partials/banner sur TOUTES les pages
   - normalise: item • item • item (pas de point en fin)
   - copie stricte du contenu A vers B (aria-hidden)
   - distance EXACTE = largeur du bloc A (en px) => zéro trou
========================================================= */

(() => {
  // 👉 Ton fichier: /partials/banner (sans extension)
  // Si tu l'as renommé en banners.html => remplace par "partials/banners.html"
  function getBannersPath() {
    // pages dans /articles/ => remonter d'un niveau
    return location.pathname.includes("/articles/") ? "../partials/banner" : "partials/banner";
  }

  async function injectBanners() {
    const host = document.getElementById("banners");
    if (!host) return;

    const url = getBannersPath();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.warn("Banners partial introuvable:", url, res.status);
      return;
    }

    host.innerHTML = await res.text();
  }

  const makeDot = () => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.innerHTML = "&nbsp;•&nbsp;";
    return dot;
  };

  function normalizeContent(content) {
    // On prend UNIQUEMENT les .item (dans l’ordre)
    const items = Array.from(content.querySelectorAll(":scope > .item, :scope > span.item"));
    if (!items.length) return;

    // Reconstruit: item • item • item (PAS de dot final)
    content.replaceChildren();
    items.forEach((item, idx) => {
      if (idx > 0) content.appendChild(makeDot());
      content.appendChild(item.cloneNode(true));
    });
  }

  function setupOneMarquee(marquee) {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;

    const contents = Array.from(track.querySelectorAll(".marquee__content"));
    if (contents.length < 2) return;

    // 1) Normalise A (premier bloc)
    normalizeContent(contents[0]);

    // 2) Copie STRICTE vers B (aria-hidden)
    for (let i = 1; i < contents.length; i++) {
      contents[i].innerHTML = contents[0].innerHTML;
    }

    // 3) Distance = largeur EXACTE du bloc A (px) => boucle parfaite
    const distance = contents[0].scrollWidth;

    // vitesse (px/s)
    const slow = track.classList.contains("marquee__track--slow");
    const speed = slow ? 55 : 75;
    const duration = Math.max(8, distance / speed); // min 8s

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-duration", duration + "s");
  }

  function initMarquees() {
    document.querySelectorAll(".banner .marquee").forEach(setupOneMarquee);
  }

  async function initAll() {
    // 1) Injecte les bannières (si placeholder présent)
    await injectBanners();

    // 2) Recalcule après chargement complet (logos inclus)
    //    On lance tout de suite une fois, puis au load.
    initMarquees();
    window.addEventListener("load", initMarquees);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Recalc au resize (debounce)
  window.addEventListener("resize", () => {
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(initMarquees, 150);
  });
})();
