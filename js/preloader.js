// Preloader with "First Visit Only" logic using sessionStorage
(function () {
  "use strict";

  const STORAGE_KEY = "weddingPreloaderShown";
  const MIN_DISPLAY_TIME = 3000; // 3 seconds minimum

  // Check if this is first visit in session
  function isFirstVisit() {
    return !sessionStorage.getItem(STORAGE_KEY);
  }

  // Mark as visited
  function markAsVisited() {
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  // Initialize preloader
  function initPreloader() {
    const preloader = document.querySelector(".preloader-area");
    if (!preloader) return;

    // If not first visit, hide immediately
    if (!isFirstVisit()) {
      preloader.style.display = "none";
      return;
    }

    // First visit - show preloader
    document.body.classList.add("loading");
    preloader.style.display = "flex";

    const startTime = Date.now();

    // Hide preloader function
    function hidePreloader() {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        preloader.classList.add("fade-out");
        document.body.classList.remove("loading");

        // Mark as visited
        markAsVisited();

        // Remove from DOM after fade animation
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, remainingTime);
    }

    // Wait for page to fully load
    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader);
    }

    // Safety fallback: force hide after 10 seconds
    setTimeout(() => {
      if (preloader && preloader.style.display !== "none") {
        hidePreloader();
      }
    }, 10000);
  }

  // Run immediately
  initPreloader();
})();
