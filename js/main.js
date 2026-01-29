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
document.addEventListener("DOMContentLoaded", () => {
  // Normalise les bannières: enlève dot/sep existants et remet un dot propre entre chaque item.
  const contents = document.querySelectorAll(".topbar .banner .marquee__content");

  contents.forEach((content) => {
    // 1) Récupère uniquement les items (dans l'ordre)
    const items = Array.from(content.querySelectorAll(".item"));

    // 2) Vide le contenu actuel (ça supprime les .dot, .sep, et les "•" mal placés)
    content.textContent = "";
    // Si tu as des images (logos) dans les items, il faut cloner les nodes, pas textContent:
    // => On reconstruit en clonant les items.
    items.forEach((item, idx) => {
      if (idx > 0) {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.innerHTML = "&nbsp;•&nbsp;";
        content.appendChild(dot);
      }
      content.appendChild(item.cloneNode(true));
    });
  });
});
