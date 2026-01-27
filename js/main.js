// Appliquer les images de fond aux actus
document.querySelectorAll(".news[data-bg]").forEach(card => {
  card.style.backgroundImage = `url('${card.dataset.bg}')`;
});
