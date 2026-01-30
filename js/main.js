// Background images via data-bg (si tu l’utilises ailleurs)
document.querySelectorAll(".news[data-bg]").forEach((card) => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// Menu actif automatiquement selon la page (nécessite data-nav dans les liens)
(function setActiveNav() {
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
   MARQUEE STABLE
   - normalise dots
   - copie stricte contenu B
   - calcule distance exacte (px) + durée
   ========================= */
(() => {
  const makeDot = () => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.innerHTML = "&nbsp;•&nbsp;";
    return dot;
  };

  const normalizeContent = (content) => {
    const items = Array.from(content.querySelectorAll(".item"));
    if (!items.length) return;

    // Reconstruit: item • item • item (PAS de point final)
    content.replaceChildren();
    items.forEach((item, idx) => {
      if (idx > 0) content.appendChild(makeDot());
      content.appendChild(item.cloneNode(true));
    });
  };

  const setupTrack = (track) => {
    const contents = Array.from(track.querySelectorAll(".marquee__content"));
    if (contents.length < 2) return;

    // 1) normalise A
    normalizeContent(contents[0]);

    // 2) copie stricte A => B (et autres si existants)
    for (let i = 1; i < contents.length; i++) {
      contents[i].innerHTML = contents[0].innerHTML;
    }

    // 3) distance exacte = largeur du bloc A
    const distance = contents[0].scrollWidth;

    // vitesse
    const slow = track.classList.contains("marquee__track--slow");
    const speed = slow ? 55 : 75; // px/sec
    const duration = Math.max(6, distance / speed);

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-duration", duration + "s");
  };

  const init = () => {
    document.querySelectorAll(".marquee__track").forEach(setupTrack);
  };

  window.addEventListener("load", init);
  window.addEventListener("resize", () => {
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(init, 150);
  });
})();
