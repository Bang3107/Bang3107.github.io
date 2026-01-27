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
        toggleBtn.title = "Tắt nhạc";
      }
    }

    toggleBtn.addEventListener("click", function () {
      if (audioPlayer.paused) {
        audioPlayer.play().catch(function (error) {
          console.log("Không thể phát nhạc:", error);
        });
      } else {
        audioPlayer.pause();
      }
    });

    audioPlayer.addEventListener("play", updateIcon);
    audioPlayer.addEventListener("pause", updateIcon);
    audioPlayer.addEventListener("ended", updateIcon);

    // Nếu autoPlay = true, hiển thị icon playing ngay từ đầu
    if (window.siteConfig && window.siteConfig.music && window.siteConfig.music.autoPlay) {
      iconMuted.style.display = "none";
      iconPlaying.style.display = "block";
      toggleBtn.style.background = "#E85D75";
      toggleBtn.title = "Tắt nhạc";
      
      setTimeout(function () {
        audioPlayer.play().catch(function (error) {
          console.log("Autoplay bị chặn:", error);
          // Nếu autoplay bị chặn, chuyển về icon muted
          iconMuted.style.display = "block";
          iconPlaying.style.display = "none";
          toggleBtn.title = "Bật nhạc";
          toggleBtn.style.animation = "musicPulse 1.5s infinite";
        });
      }, 1000);
    } else {
      updateIcon();
    }

    const style = document.createElement("style");
    style.textContent = `
      /* Remove black border/outline on the music toggle */
      #simpleMusicToggle {
        outline: none !important;
        border: none !important;
        box-shadow: none; /* remove dark shadow that can look like a black border */
      }
      @keyframes musicPulse {
        0%, 100% { 
          transform: scale(1); 
          box-shadow: 0 4px 15px rgba(232, 93, 117, 0.35);
        }
        50% { 
          transform: scale(1.1); 
          box-shadow: 0 6px 20px rgba(232, 93, 117, 0.6);
        }
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
