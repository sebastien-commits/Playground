// 1) Appliquer les backgrounds via data-bg
document.querySelectorAll(".news[data-bg]").forEach(card => {
  const url = card.getAttribute("data-bg");
  if (url) card.style.backgroundImage = `url('${url}')`;
});

// 2) Menu actif automatiquement selon la page
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

// 3) Recherche = icône seule (prompt) puis redirection vers actus.html?q=...
(function searchPrompt() {
  const btn = document.querySelector(".search-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const q = prompt("Rechercher une actu :");
    if (!q) return;
    const query = encodeURIComponent(q.trim());
    window.location.href = `actus.html?q=${query}`;
  });
})();
