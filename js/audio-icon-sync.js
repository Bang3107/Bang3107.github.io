(function () {
  "use strict";

  function initAudioIconSync() {
    var audio = document.querySelector("audio");
    var iconOff = document.getElementById("playerVolumeOff");
    var iconOn = document.getElementById("playerVolumeOn");

    if (iconOff && iconOn) {
      iconOff.style.display = "inline-block";
      iconOn.style.display = "none";
    }

    function showOff() {
      if (iconOff && iconOn) {
        iconOff.style.display = "inline-block";
        iconOn.style.display = "none";
      }
    }

    function showOn() {
      if (iconOff && iconOn) {
        iconOff.style.display = "none";
        iconOn.style.display = "inline-block";
      }
    }

    if (audio) {
      audio.addEventListener("canplay", showOn);
      audio.addEventListener("play", showOn);
      audio.addEventListener("pause", showOff);
      if (!audio.paused) {
        showOn();
      }
    }
  }

  setTimeout(function () {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAudioIconSync);
    } else {
      initAudioIconSync();
    }
  }, 800);
})();
