(function () {
  "use strict";

  function initAudioIconSync() {
    var audio = document.querySelector("audio");
    var iconOff = document.getElementById("playerVolumeOff");
    var iconOn = document.getElementById("playerVolumeOn");

    // Key để lưu vào bộ nhớ trình duyệt
    var STORAGE_KEY = "music_is_playing";

    // 1. Hàm hiển thị Icon Tắt
    function showOff() {
      if (iconOff && iconOn) {
        iconOff.style.display = "inline-block";
        iconOn.style.display = "none";
      }
      // Lưu trạng thái vào bộ nhớ
      localStorage.setItem(STORAGE_KEY, "false");
    }

    // 2. Hàm hiển thị Icon Bật
    function showOn() {
      if (iconOff && iconOn) {
        iconOff.style.display = "none";
        iconOn.style.display = "inline-block";
      }
      // Lưu trạng thái vào bộ nhớ
      localStorage.setItem(STORAGE_KEY, "true");
    }

    if (audio) {
      // Gắn sự kiện lắng nghe
      audio.addEventListener("play", showOn);
      audio.addEventListener("pause", showOff);

      // --- PHẦN QUAN TRỌNG: KHÔI PHỤC TRẠNG THÁI KHI F5 ---

      // Kiểm tra xem lần trước có đang bật nhạc không
      var shouldPlay = localStorage.getItem(STORAGE_KEY) === "true";

      if (shouldPlay) {
        // Cố gắng phát nhạc
        var playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(function () {
              // Thành công (thường là ở Localhost)
              showOn();
            })
            .catch(function (error) {
              // Thất bại do chính sách Autoplay (thường là trên GitHub Pages)
              console.log("Autoplay bị chặn, chờ tương tác người dùng.");
              showOff(); // Vẫn hiện icon tắt

              // Mẹo: Chờ người dùng click bất kỳ đâu để phát nhạc
              var playOnInteraction = function () {
                audio.play();
                // Xóa sự kiện này sau khi đã chạy xong
                document.removeEventListener("click", playOnInteraction);
                document.removeEventListener("touchstart", playOnInteraction);
              };

              document.addEventListener("click", playOnInteraction);
              document.addEventListener("touchstart", playOnInteraction);
            });
        }
      } else {
        // Nếu lần trước tắt, thì giờ cũng tắt
        showOff();
      }
    }
  }

  // Giữ nguyên timeout của bạn để đợi các thành phần load xong
  setTimeout(function () {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAudioIconSync);
    } else {
      initAudioIconSync();
    }
  }, 800);
})();
