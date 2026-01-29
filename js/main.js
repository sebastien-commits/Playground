// Background images via data-bg
document.querySelectorAll(".news[data-bg]").forEach(card => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// Menu actif automatiquement selon la page
(function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": "actus",     // accueil = actus
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
(function () {
  function initMarquees() {
    document.querySelectorAll('.marquee').forEach((marquee) => {
      const track = marquee.querySelector('.marquee__track');
      const contents = track ? track.querySelectorAll('.marquee__content') : null;
      if (!track || !contents || contents.length < 2) return;

      // Distance = largeur EXACTE du 1er bloc (donc zéro trou)
      const distance = contents[0].scrollWidth;

      // Vitesse en px/s (ajuste si tu veux)
      const slow = track.classList.contains('marquee__track--slow');
      const speed = slow ? 55 : 75; // px/sec
      const duration = distance / speed;

      track.style.setProperty('--marquee-distance', distance + 'px');
      track.style.setProperty('--marquee-duration', duration + 's');
    });
  }

  // au chargement + après le rendu des images
  window.addEventListener('load', initMarquees);
  window.addEventListener('resize', () => {
    // petit debounce simple
    clearTimeout(window.__mq_t);
    window.__mq_t = setTimeout(initMarquees, 150);
  });
})();
