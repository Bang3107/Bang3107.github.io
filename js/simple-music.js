(function () {
  "use strict";

  let audioPlayer = null;

  function initSimpleMusicPlayer() {
    // Tìm hoặc tạo audio element
    audioPlayer = document.querySelector("audio");
    if (!audioPlayer) {
      audioPlayer = document.createElement("audio");
      audioPlayer.loop = true;
      audioPlayer.volume = 0.3; // Giảm âm lượng xuống 30%
      if (window.siteConfig && window.siteConfig.music && window.siteConfig.music.src) {
        audioPlayer.src = window.siteConfig.music.src;
      }
      document.body.appendChild(audioPlayer);
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
        const STORAGE_KEY = "music_is_playing";
        toggleBtn.title = "Tắt nhạc";
      }
    }

    toggleBtn.addEventListener("click", function () {
      if (audioPlayer.paused) {
        audioPlayer.play().catch(function (error) {
          console.log("Không thể phát nhạc:", error);
          audioPlayer.preload = "auto";
          audioPlayer.setAttribute("playsinline", "true"); // iOS Safari cho phép phát inline
          audioPlayer.setAttribute("autoplay", ""); // cố gắng autoplay khi được phép
        });
      } else {
        audioPlayer.pause();
      }
    });

    audioPlayer.addEventListener("play", updateIcon);
    audioPlayer.addEventListener("pause", updateIcon);
    audioPlayer.addEventListener("ended", updateIcon);

    updateIcon();

    if (window.siteConfig && window.siteConfig.music && window.siteConfig.music.autoPlay) {
      setTimeout(function () {
        audioPlayer.play().catch(function (error) {
          console.log("Autoplay bị chặn:", error);
          toggleBtn.style.animation = "musicPulse 1.5s infinite";
        });
      }, 1000);
    }

    const style = document.createElement("style");
    style.textContent = `

          // Cố gắng phát nhạc; nếu bị chặn bởi chính sách autoplay, chờ tương tác người dùng rồi phát
          function attemptPlay() {
            const playPromise = audioPlayer.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise
                .then(function () {
                  // thành công, không cần làm gì; sự kiện "play" sẽ cập nhật icon
                })
                .catch(function (error) {
                  console.log("Autoplay bị chặn, sẽ phát khi có tương tác:", error);
                  // gợi ý trực quan để người dùng bấm
                  toggleBtn.style.animation = "musicPulse 1.5s infinite";

                  const resumeOnInteract = function () {
                    audioPlayer.play().finally(function () {
                      toggleBtn.style.animation = "";
                    });
                    removeInteracts();
                  };

                  const removeInteracts = function () {
                    document.removeEventListener("click", resumeOnInteract);
                    document.removeEventListener("touchstart", resumeOnInteract);
                    document.removeEventListener("pointerdown", resumeOnInteract);
                    document.removeEventListener("keydown", resumeOnInteract);
                    document.removeEventListener("scroll", resumeOnInteract, { passive: true });
                  };

                  document.addEventListener("click", resumeOnInteract, { once: true });
                  document.addEventListener("touchstart", resumeOnInteract, { once: true });
                  document.addEventListener("pointerdown", resumeOnInteract, { once: true });
                  document.addEventListener("keydown", resumeOnInteract, { once: true });
                  document.addEventListener("scroll", resumeOnInteract, { once: true, passive: true });
                });
            }
          }
      /* Remove black border/outline on the music toggle */
      #simpleMusicToggle {
        outline: none !important;
              attemptPlay();
      @keyframes musicPulse {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 4px 15px rgba(232, 93, 117, 0.35);
        }
          audioPlayer.addEventListener("play", function () {
            updateIcon();
            toggleBtn.style.animation = "";
            try {
              localStorage.setItem(STORAGE_KEY, "true");
            } catch (e) {}
          });
          audioPlayer.addEventListener("pause", function () {
            updateIcon();
            try {
              localStorage.setItem(STORAGE_KEY, "false");
            } catch (e) {}
          });
          box-shadow: 0 6px 20px rgba(232, 93, 117, 0.6);
        }
          // Khởi tạo icon ban đầu
          updateIcon();

          // Nếu được cấu hình autoPlay hoặc trước đó đang phát, cố gắng phát lại
          const shouldAutoPlay =
            (window.siteConfig && window.siteConfig.music && window.siteConfig.music.autoPlay) ||
            (function () {
              try {
                return localStorage.getItem(STORAGE_KEY) === "true";
              } catch (e) {
                return false;
              }
            })();

          if (shouldAutoPlay) {
            setTimeout(function () {
              attemptPlay();
            }, 600);
          }
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
