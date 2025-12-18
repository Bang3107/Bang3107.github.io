(function () {
  "use strict";

  const STORAGE_KEY = "weddingPreloaderShown";
  const MIN_DISPLAY_TIME = 4000; // 4s
  const MAX_DISPLAY_TIME = 10000; // 10s

  let isHidden = false;

  function hasVisited() {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  function markAsVisited() {
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  function initPreloader() {
    const preloader = document.querySelector(".preloader-area");
    if (!preloader) return;

    document.body.classList.add("loading");
    preloader.style.display = "flex";

    const startTime = Date.now();
    const visited = hasVisited(); // ⭐ đã vào trước đó chưa

    function hidePreloader(force = false) {
      if (isHidden) return;
      isHidden = true;

      const elapsed = Date.now() - startTime;
      const delay = force ? 0 : Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        preloader.classList.add("fade-out");
        document.body.classList.remove("loading");

        // Chỉ set key khi lần đầu
        if (!visited) {
          markAsVisited();
        }

        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, delay);
    }

    /* 🔹 ĐÃ CÓ KEY → KHÔNG CHỜ LOAD, CHỈ HIỆN ĐỦ 3s */
    if (visited) {
      setTimeout(() => hidePreloader(), MIN_DISPLAY_TIME);
    } else {
    /* 🔹 LẦN ĐẦU → CHỜ LOAD */
      if (document.readyState === "complete") {
        hidePreloader();
      } else {
        window.addEventListener("load", () => hidePreloader());
      }
    }

    /* ⛔ FORCE HIDE sau 10s */
    setTimeout(() => {
      hidePreloader(true);
    }, MAX_DISPLAY_TIME);
  }

  initPreloader();
})();
