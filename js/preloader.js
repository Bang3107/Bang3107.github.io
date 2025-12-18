(function () {
  "use strict";

  const STORAGE_KEY = "weddingPreloaderShown";
  const MIN_DISPLAY_TIME = 2000; // 4s
  const MAX_DISPLAY_TIME = 5000; // 7s

  let isHidden = false;

  function hasVisited() {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  function markAsVisited() {
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  // Hàm tắt Preloader (Core)
  function hidePreloader(preloader, startTime, force = false) {
    if (isHidden) return;
    isHidden = true;

    const elapsed = Date.now() - startTime;
    const delay = force ? 0 : Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloader.classList.add("fade-out");
      document.body.classList.remove("loading");

      // Chỉ lưu session nếu chưa từng lưu
      if (!hasVisited()) markAsVisited();

      setTimeout(() => {
        preloader.style.display = "none";
      }, 800);
    }, delay);
  }

  function initPreloader() {
    // 🛠️ FIX QUAN TRỌNG: Đảm bảo phần tử tồn tại trước khi chạy logic
    const preloader = document.querySelector(".preloader-area");

    // Nếu chưa tìm thấy (do script chạy quá sớm), thử lại sau 50ms
    if (!preloader) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPreloader);
      }
      return;
    }

    document.body.classList.add("loading");
    preloader.style.display = "flex";

    const startTime = Date.now();
    const visited = hasVisited();

    /* --- LOGIC XỬ LÝ --- */

    // 1. Luôn đặt timer 10s "cứu hộ" ngay lập tức
    setTimeout(() => {
      hidePreloader(preloader, startTime, true);
    }, MAX_DISPLAY_TIME);

    // 2. Logic chính
    if (visited) {
      // Người cũ: Chỉ hiện 4s rồi tắt, không chờ load
      setTimeout(() => hidePreloader(preloader, startTime), MIN_DISPLAY_TIME);
    } else {
      // Người mới: Chờ load xong + đủ 4s
      if (document.readyState === "complete") {
        hidePreloader(preloader, startTime);
      } else {
        window.addEventListener("load", () => hidePreloader(preloader, startTime));
      }
    }
  }

  // Khởi chạy
  initPreloader();
})();
