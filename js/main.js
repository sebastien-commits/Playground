function startMarquee(id, speed) {
  const ticker = document.getElementById(id);
  const marquee = ticker.querySelector(".marquee");

  // dupliquer le contenu pour éviter les trous
  marquee.innerHTML += marquee.innerHTML;

  const width = marquee.scrollWidth / 2;

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes scroll-${id} {
      from { transform: translateX(0); }
      to { transform: translateX(-${width}px); }
    }
  `;
  document.head.appendChild(style);

  marquee.style.animation = `scroll-${id} ${speed}s linear infinite`;
}

window.addEventListener("load", () => {
  startMarquee("scores", 30);     // lent
  startMarquee("transfers", 26);  // légèrement plus rapide
});
