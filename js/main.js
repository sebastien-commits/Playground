// Background images via data-bg (accueil)
document.querySelectorAll(".news[data-bg]").forEach(card => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// (Option) rendre les blocs .news cliquables si data-href existe
document.querySelectorAll(".news[data-href]").forEach(card => {
  card.addEventListener("click", () => {
    const href = card.getAttribute("data-href");
    if (href) window.location.href = href;
  });
});

// Menu actif automatiquement selon la page
(function setActiveNav() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const map = {
    "index.html": null,
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
