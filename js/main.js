// Background images via data-bg
document.querySelectorAll(".news[data-bg]").forEach(card => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// Menu actif automatiquement selon la page
(function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
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
   MARQUEE PERFECT LOOP (SCORES + TRANSFERTS)
   - calcule exactement la largeur d'une "période" (1er .marquee__content)
   - duplique si besoin pour éviter TOUT trou
   - fixe CSS vars : --shift (px) et --duration (s)
   - stable même si les SVG mettent du temps à charger
   ========================================================= */
(function perfectMarquee() {
  const marquees = document.querySelectorAll(".marquee");
  if (!marquees.length) return;

  function setupOne(marquee) {
    const track = marquee.querySelector(".marquee__track");
    if (!track) return;

    // Le premier content sert de période
    const first = track.querySelector(".marquee__content");
    if (!first) return;

    // Reset propre : on garde le 1er + 1 copie, puis on complète si besoin
    const firstClone = first.cloneNode(true);

    // Nettoyage (on garde uniquement 1 période + 1 copie)
    track.innerHTML = "";
    track.appendChild(first);
    track.appendChild(firstClone);

    // Duplique jusqu'à couvrir largement la largeur écran (évite trous)
    const ensureCoverage = () => {
      // On veut une longueur confortable: > 2.5x largeur écran
      const target = window.innerWidth * 2.5;
      while (track.scrollWidth < target) {
        track.appendChild(first.cloneNode(true));
      }
    };
    ensureCoverage();

    // Mesure la largeur d'une période (uniquement le 1er content)
    const periodWidth = first.getBoundingClientRect().width;

    // Vitesse différente : track--slow = plus lent
    const isSlow = track.classList.contains("marquee__track--slow");
    const pxPerSec = isSlow ? 55 : 75; // ajuste si tu veux

    // Durée = distance / vitesse
    const duration = periodWidth / pxPerSec;

    marquee.style.setProperty("--shift", `${periodWidth}px`);
    marquee.style.setProperty("--duration", `${duration}s`);
  }

  function setupAll() {
    marquees.forEach(setupOne);
  }

  // 1) init après chargement complet (important pour SVG)
  window.addEventListener("load", setupAll);

  // 2) si jamais des SVG arrivent encore après, on recalc dès qu'un logo charge
  document.querySelectorAll(".team-logo").forEach(img => {
    img.addEventListener("load", () => setupAll(), { once: true });
    img.addEventListener("error", () => setupAll(), { once: true });
  });

  // 3) resize (debounce)
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(setupAll, 150);
  });
})();
