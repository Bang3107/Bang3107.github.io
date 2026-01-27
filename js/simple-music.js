(function () {
  "use strict";

  let audioPlayer = null;
  const STORAGE_KEY_PLAYING = "site_music_playing";
  const STORAGE_KEY_TIME = "site_music_time";

  function initSimpleMusicPlayer() {
    // 1. Tìm hoặc tạo audio element
    audioPlayer = document.querySelector("audio");
    if (!audioPlayer) {
      audioPlayer = document.createElement("audio");
      audioPlayer.loop = true;
      audioPlayer.volume = 0.3;
      if (window.siteConfig && window.siteConfig.music && window.siteConfig.music.src) {
        audioPlayer.src = window.siteConfig.music.src;
      }
      document.body.appendChild(audioPlayer);
    }

    // 2. Khôi phục thời gian phát nhạc từ LocalStorage (nếu có)
    const savedTime = localStorage.getItem(STORAGE_KEY_TIME);
    if (savedTime) {
      audioPlayer.currentTime = parseFloat(savedTime);
    }

    const toggleBtn = document.getElementById("simpleMusicToggle");
    const iconMuted = document.getElementById("musicIconMuted");
    const iconPlaying = document.getElementById("musicIconPlaying");

    function updateIcon() {
      if (audioPlayer.paused) {
        iconMuted.style.display = "block";
        iconPlaying.style.display = "none";
        toggleBtn.style.background = "#E85D75";
        toggleBtn.title = "Bật nhạc";
      } else {
        iconMuted.style.display = "none";
        iconPlaying.style.display = "block";
        toggleBtn.style.background = "#E85D75";
        toggleBtn.title = "Tắt nhạc";
      }
    }

    // 3. Xử lý click và LƯU TRẠNG THÁI
    toggleBtn.addEventListener("click", function () {
      if (audioPlayer.paused) {
        audioPlayer
          .play()
          .then(() => {
            localStorage.setItem(STORAGE_KEY_PLAYING, "true"); // Lưu trạng thái đang bật
          })
          .catch(function (error) {
            console.log("Không thể phát nhạc:", error);
          });
      } else {
        audioPlayer.pause();
        localStorage.setItem(STORAGE_KEY_PLAYING, "false"); // Lưu trạng thái đang tắt
      }
    });

    audioPlayer.addEventListener("play", updateIcon);
    audioPlayer.addEventListener("pause", updateIcon);

    // 4. Lưu thời gian nhạc liên tục khi đang phát (để F5 hát tiếp đoạn đó)
    // Lưu mỗi khi nhạc tắt hoặc trang bị đóng/reload
    window.addEventListener("beforeunload", function () {
      localStorage.setItem(STORAGE_KEY_TIME, audioPlayer.currentTime);
    });

    updateIcon();

    // 5. Kiểm tra LocalStorage để tự động phát lại khi F5
    const shouldPlay = localStorage.getItem(STORAGE_KEY_PLAYING) === "true";
    const configAutoPlay = window.siteConfig && window.siteConfig.music && window.siteConfig.music.autoPlay;

    if (shouldPlay || configAutoPlay) {
      // Delay nhỏ để đảm bảo DOM sẵn sàng và tránh xung đột
      setTimeout(function () {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Phát thành công
              console.log("Đã khôi phục trạng thái phát nhạc.");
            })
            .catch(function (error) {
              // Autoplay bị chặn bởi trình duyệt
              console.log("Autoplay bị chặn (cần tương tác người dùng):", error);
              localStorage.setItem(STORAGE_KEY_PLAYING, "false"); // Reset về false nếu bị chặn
              toggleBtn.style.animation = "musicPulse 1.5s infinite"; // Nhắc người dùng bấm
              updateIcon(); // Cập nhật lại icon về trạng thái tắt
            });
        }
      }, 500);
    }

    // --- Phần CSS giữ nguyên ---
    const style = document.createElement("style");
    style.textContent = `
      #simpleMusicToggle {
        outline: none !important;
        border: none !important;
        box-shadow: none;
      }
      @keyframes musicPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(232, 93, 117, 0.35); }
        50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(232, 93, 117, 0.6); }
      }
      #simpleMusicToggle:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 25px rgba(232, 93, 117, 0.5) !important;
      }
      #simpleMusicToggle:active {
        transform: scale(0.95);
      }
      @media (max-width: 799px) {
        #simpleMusicToggle {
          bottom: 20px !important;
          left: 20px !important;
          width: 50px !important;
          height: 50px !important;
        }
        #simpleMusicToggle svg {
          width: 24px !important;
          height: 24px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSimpleMusicPlayer);
  } else {
    setTimeout(initSimpleMusicPlayer, 500);
  }
})();
