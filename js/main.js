console.log("Playground prêt 🚀");

function startMarquee(id, speed) {
  const container = document.getElementById(id);
  const content = container.querySelector('.marquee-content');

  if (!container || !content) return;

  const width = content.scrollWidth;

  // créer une animation unique par bannière
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes scroll-${id} {
      from { transform: translateX(0); }
      to { transform: translateX(-${width}px); }
    }
  `;
  document.head.appendChild(style);

  content.style.animation = `scroll-${id} ${speed}s linear infinite`;
}

// lancer les animations quand la page est chargée
window.addEventListener('load', () => {
  startMarquee('scores', 30);     // bannière scores (lent)
  startMarquee('transfers', 26);  // bannière transferts
})

