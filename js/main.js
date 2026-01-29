// Background images via data-bg
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

/* =========================
   MARQUEE FIX (DOTS + LOOP SANS VIDE)
   ========================= */
(() => {
  const makeDot = () => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.innerHTML = "&nbsp;•&nbsp;";
    return dot;
  };

  const normalizeContent = (content) => {
    // Récupère les .item dans l’ordre
    const items = Array.from(content.querySelectorAll(".item"));
    if (!items.length) return;

    // Reconstruit: item + dot + item + dot...
    content.replaceChildren();
    items.forEach((item, idx) => {
      if (idx > 0) content.appendChild(makeDot());
      content.appendChild(item.cloneNode(true));
    });

    // IMPORTANT : PAS de point à la fin.
    // Le raccord fin->début est assuré par la duplication du contenu.
  };

  const setupMarquee = (marquee) => {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;

    const contents = Array.from(track.querySelectorAll(".marquee__content"));
    if (contents.length < 2) return;

    // 1) Normalise le contenu A
    normalizeContent(contents[0]);

    // 2) Force le contenu B (aria-hidden) à être une copie STRICTE de A
    for (let i = 1; i < contents.length; i++) {
      contents[i].innerHTML = contents[0].innerHTML;
    }

    // 3) Calcule la distance exacte du bloc A => boucle parfaite sans vide
    const distance = contents[0].scrollWidth;

    // Vitesse en px/s (ajuste si tu veux)
    const slow = track.classList.contains("marquee__track--slow");
    const speed = slow ? 55 : 75; // px/sec
    const duration = distance / speed;

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-duration", duration + "s");
  };

  const init = () => {
    document.querySelectorAll(".marquee").forEach(setupMarquee);
  };

  // Après chargement complet (logos inclus) + recalcul au resize
  window.addEventListener("load", init);

  window.addEventListener("resize", () => {
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(init, 150);
  });
})();
