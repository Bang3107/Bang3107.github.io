(function () {
  "use strict";

  // ========== CONSTANTS ==========
  const WISHES_COLLECTION = "wishes";
  const MAX_NAME_LENGTH = 100;
  const MAX_EMAIL_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 1000;
  const CACHE_KEY = "wedding_wishes_cache";
  const CACHE_DURATION = 30 * 1000; // 30 giây (giảm từ 5 phút để cập nhật nhanh hơn)

  // ========== HELPER FUNCTIONS ==========
  function isValidEmail(email) {
    if (!email) return true; // Email không bắt buộc
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function showLoading(btn) {
    btn.dataset.originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Đang gửi...";
  }

  function hideLoading(btn) {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || "Gửi lời chúc";
  }

  // ========== FIREBASE OPERATIONS ==========
  async function saveWishToFirebase(name, email, content) {
    if (!window.firebaseDB) {
      throw new Error("Firebase chưa được khởi tạo. Vui lòng kiểm tra config.");
    }

    try {
      const docRef = await window.firebaseAddDoc(window.firebaseCollection(window.firebaseDB, WISHES_COLLECTION), {
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
        createdAt: window.firebaseServerTimestamp(),
      });
      console.log("✅ Lời chúc đã được lưu với ID:", docRef.id);
      return docRef;
    } catch (error) {
      console.error("❌ Lỗi khi lưu lời chúc:", error);
      throw error;
    }
  }

  // Xóa cache để load dữ liệu mới
  function clearWishesCache() {
    localStorage.removeItem(CACHE_KEY);
    console.log("🗑️ Đã xóa cache lời chúc");
  }

  async function loadWishesFromFirebase(forceRefresh = false) {
    if (!window.firebaseDB) {
      console.warn("Firebase chưa được khởi tạo");
      return [];
    }

    try {
      // Kiểm tra cache (trừ khi force refresh)
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log("📦 Loaded wishes from cache");
            return data;
          }
        }
      }

      // Fetch từ Firestore
      const q = window.firebaseQuery(window.firebaseCollection(window.firebaseDB, WISHES_COLLECTION), window.firebaseOrderBy("createdAt", "desc"), window.firebaseLimit(50));

      const snapshot = await window.firebaseGetDocs(q);
      const wishes = [];
      snapshot.forEach((doc) => {
        wishes.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Lưu cache
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: wishes,
          timestamp: Date.now(),
        })
      );

      console.log("✅ Loaded", wishes.length, "wishes from Firestore");
      return wishes;
    } catch (error) {
      console.error("❌ Lỗi khi tải lời chúc:", error);
      return [];
    }
  }

  function renderWishes(wishes) {
    const wishBox = document.querySelector(".wish-box");
    if (!wishBox) return;

    // Giữ lại lời chúc demo có class 'bg'
    const demoWishes = Array.from(wishBox.querySelectorAll(".wish-box-item.bg"));
    wishBox.innerHTML = "";

    // Thêm lời chúc mới
    wishes.forEach((wish) => {
      const wishItem = document.createElement("div");
      wishItem.className = "wish-box-item";
      wishItem.innerHTML = `
            <strong>${escapeHtml(wish.name)}</strong>
            <p>${escapeHtml(wish.content)}</p>
          `;
      wishBox.appendChild(wishItem);
    });

    // Thêm lại lời chúc demo ở cuối
    demoWishes.forEach((demo) => wishBox.appendChild(demo));
  }

  // ========== FORM SUBMIT HANDLER ==========
  function initWishForm() {
    const wishForm = document.getElementById("wish-form");
    if (!wishForm) {
      console.warn("Không tìm thấy form gửi lời chúc");
      return;
    }

    // Loại bỏ action để tránh submit tới endpoint mặc định của theme
    try {
      wishForm.removeAttribute("action");
    } catch (e) {}

    // Nếu theme đã gắn handler bằng jQuery, hủy nó để tránh AJAX POST 405
    try {
      if (window.jQuery) {
        window.jQuery(wishForm).off("submit");
      }
    } catch (e) {}

    // Dùng capture để chặn các handler khác chạy trước
    wishForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      // Ngăn các submit handler khác của theme
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }
      e.stopPropagation();

      // Lấy dữ liệu form
      const nameInput = wishForm.querySelector('input[name="name"]');
      const emailInput = wishForm.querySelector('input[name="email"]');
      const contentInput = wishForm.querySelector('textarea[name="content"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const content = contentInput.value.trim();

      // Validate
      if (!name) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập họ tên của bạn!",
          confirmButtonColor: "#de4659",
        });
        nameInput.focus();
        return;
      }

      if (name.length > MAX_NAME_LENGTH) {
        Swal.fire({
          icon: "warning",
          title: "Tên quá dài",
          text: `Họ tên không được vượt quá ${MAX_NAME_LENGTH} ký tự!`,
          confirmButtonColor: "#de4659",
        });
        nameInput.focus();
        return;
      }

      if (!content) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập lời chúc của bạn!",
          confirmButtonColor: "#de4659",
        });
        contentInput.focus();
        return;
      }

      if (content.length > MAX_CONTENT_LENGTH) {
        Swal.fire({
          icon: "warning",
          title: "Lời chúc quá dài",
          text: `Lời chúc không được vượt quá ${MAX_CONTENT_LENGTH} ký tự!`,
          confirmButtonColor: "#de4659",
        });
        contentInput.focus();
        return;
      }

      if (email && !isValidEmail(email)) {
        Swal.fire({
          icon: "warning",
          title: "Email không hợp lệ",
          text: "Vui lòng nhập đúng định dạng email!",
          confirmButtonColor: "#de4659",
        });
        emailInput.focus();
        return;
      }

      if (email && email.length > MAX_EMAIL_LENGTH) {
        Swal.fire({
          icon: "warning",
          title: "Email quá dài",
          text: `Email không được vượt quá ${MAX_EMAIL_LENGTH} ký tự!`,
          confirmButtonColor: "#de4659",
        });
        emailInput.focus();
        return;
      }

      // Hiển thị loading
      const submitBtn = wishForm.querySelector('button[type="submit"]');
      showLoading(submitBtn);

      try {
        // Lưu vào Firestore
        await saveWishToFirebase(name, email, content);

        // Hiển thị thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Cảm ơn bạn! 💖",
          html: `Lời chúc của <strong>${escapeHtml(name)}</strong> đã được gửi thành công!`,
          customClass: {
            popup: "wish-success-popup",
            title: "wish-success-title",
            htmlContainer: "wish-success-html",
          },
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: "#de4659",
        });

        // Reset form
        wishForm.reset();

        // Xóa cache và reload lời chúc
        localStorage.removeItem(CACHE_KEY);
        const wishes = await loadWishesFromFirebase();
        renderWishes(wishes);
      } catch (error) {
        console.error("Lỗi khi gửi lời chúc:", error);

        let errorMessage = "Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!";

        if (error.code === "permission-denied") {
          errorMessage = "Không có quyền gửi lời chúc. Vui lòng kiểm tra cấu hình Firebase!";
        } else if (error.code === "unavailable") {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
        }

        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: errorMessage,
          confirmButtonColor: "#de4659",
        });
      } finally {
        hideLoading(submitBtn);
      }
    });
  }

  // ========== INITIALIZATION ==========
  async function init() {
    console.log("🎉 Initializing wish form...");

    // Khởi tạo form handler
    initWishForm();

    // Load và hiển thị lời chúc
    const wishes = await loadWishesFromFirebase();
    renderWishes(wishes);

    console.log("✅ Wish form initialized");
  }

  // Chờ DOM và Firebase load xong
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Đợi Firebase init (từ module script trong <head>)
    setTimeout(init, 500);
  }
})();
