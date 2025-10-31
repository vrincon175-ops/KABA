document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("progressBar");
  const percentText = document.getElementById("percentText");
  const app = document.getElementById("app");

  if (!preloader || !bar || !percentText || !app) {
    console.error("Elementos esenciales no encontrados");
    return;
  }

  let simulated = 0;
  let rafId = null;

  // Ocultar contenido principal al inicio (por si no está oculto)
  app.style.display = "none";

  function updateUI(value) {
    bar.style.width = value + "%";
    percentText.textContent = value + "%";
  }

  function step() {
    const increment = (100 - simulated) / 25;
    simulated += Math.max(0.2, increment * 0.6);
    if (simulated > 99) simulated = 99;
    updateUI(Math.floor(simulated));
    rafId = requestAnimationFrame(step);
  }

  function finishLoad() {
    if (rafId) cancelAnimationFrame(rafId);
    updateUI(100);
    percentText.textContent = "100%";

    setTimeout(() => {
      preloader.classList.add("hidden");
      app.style.display = "";  // Mostrar contenido principal
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 700);
    }, 300);
  }

  // Iniciar la animación simulada
  rafId = requestAnimationFrame(step);

  // Detectar si la página ya cargó
  if (document.readyState === "complete") {
    finishLoad();
  } else {
    window.addEventListener("load", finishLoad, { once: true });
  }

  // Forzar cierre si tarda demasiado (8 segundos)
  setTimeout(() => {
    if (!preloader.classList.contains("hidden")) finishLoad();
  }, 8000);
});
