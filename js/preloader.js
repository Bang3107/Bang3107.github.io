(function () {
  "use strict";

  const STORAGE_KEY = "weddingPreloaderShown";
  const MIN_DISPLAY_TIME = 3000; // Tối thiểu 3 giây
  const MAX_DISPLAY_TIME = 10000; // Tối đa 10 giây

  // Biến cờ để đảm bảo không ẩn 2 lần
  let isHidden = false;

  // 1. Kiểm tra session xem đã vào chưa
  function isFirstVisit() {
    return !sessionStorage.getItem(STORAGE_KEY);
  }

  // 2. Đánh dấu đã xem
  function markAsVisited() {
    sessionStorage.setItem(STORAGE_KEY, "true");
  }

  // 3. Khởi chạy Preloader
  function initPreloader() {
    const preloader = document.querySelector(".preloader-area");
    if (!preloader) return;

    // Nếu KHÔNG PHẢI lần đầu -> Ẩn ngay lập tức
    if (!isFirstVisit()) {
      preloader.style.display = "none";
      return;
    }

    // Nếu LÀ lần đầu -> Hiện preloader
    document.body.classList.add("loading");
    preloader.style.display = "flex";

    const startTime = Date.now();

    // === Hàm ẩn Preloader (Core Logic) ===
    function hidePreloader() {
      // Nếu đã ẩn rồi thì không làm gì nữa (tránh xung đột giữa Load và MaxTime)
      if (isHidden) return;

      const elapsed = Date.now() - startTime;
      // Tính thời gian cần chờ thêm (nếu load quá nhanh vẫn phải đợi đủ 3s)
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      // Đánh dấu là chuẩn bị ẩn
      isHidden = true;

      setTimeout(() => {
        preloader.classList.add("fade-out");
        document.body.classList.remove("loading");

        // Lưu trạng thái đã xem
        markAsVisited();

        // Xóa khỏi DOM sau khi animation CSS chạy xong (0.8s)
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, remainingTime);
    }

    // === Xử lý sự kiện ===

    // Trường hợp 1: Trang tải xong bình thường
    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader);
    }

    // Trường hợp 2: Bắt buộc ẩn sau 10 giây (kể cả khi mạng lag chưa load xong trang)
    setTimeout(() => {
      hidePreloader();
    }, MAX_DISPLAY_TIME);
  }

  // Chạy ngay
  initPreloader();
})();
