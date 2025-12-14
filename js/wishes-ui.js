(function () {
  "use strict";

  function initWishAutocomplete() {
    const showBtn = document.querySelector(".show-autocomplete");
    const hideBtn = document.querySelector(".hide-autocomplete");
    const autocompleteContent = document.querySelector(".wishes-autocomplete-content");

    if (!showBtn || !hideBtn || !autocompleteContent) return;

    showBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const emojiPickerContainer = document.querySelector(".emoji-picker");
      if (emojiPickerContainer) {
        emojiPickerContainer.style.display = "none";
      }
      autocompleteContent.style.display = "block";
      showBtn.style.display = "none";
      hideBtn.style.display = "inline-block";
    });

    hideBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      autocompleteContent.style.display = "none";
      hideBtn.style.display = "none";
      showBtn.style.display = "inline-block";
    });

    const wishLinks = autocompleteContent.querySelectorAll(".showContent");
    const contentTextarea = document.getElementById("content");

    wishLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        let wishText = this.textContent.trim();
        wishText = wishText.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, "");
        if (contentTextarea) {
          contentTextarea.value = wishText;
          contentTextarea.focus();
        }
        autocompleteContent.style.display = "none";
        hideBtn.style.display = "none";
        showBtn.style.display = "inline-block";
      });
    });

    document.addEventListener("click", function (e) {
      if (!autocompleteContent.contains(e.target) && e.target !== showBtn && !showBtn.contains(e.target) && e.target !== hideBtn && !hideBtn.contains(e.target)) {
        autocompleteContent.style.display = "none";
        hideBtn.style.display = "none";
        showBtn.style.display = "inline-block";
      }
    });
  }

  function initEmojiPicker() {
    const emojiPickerBtn = document.querySelector(".emoji-picker-button");
    const emojiPickerContainer = document.querySelector(".emoji-picker");
    const emojiPickerElement = document.querySelector("emoji-picker");
    const contentTextarea = document.getElementById("content");

    if (!emojiPickerBtn || !emojiPickerContainer) return;

    emojiPickerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      document.querySelectorAll(".emoji-picker").forEach(function (picker) {
        if (picker !== emojiPickerContainer) {
          picker.style.display = "none";
        }
      });

      const autocompleteContent = document.querySelector(".wishes-autocomplete-content");
      const showBtn = document.querySelector(".show-autocomplete");
      const hideBtn = document.querySelector(".hide-autocomplete");
      if (autocompleteContent) {
        autocompleteContent.style.display = "none";
      }
      if (hideBtn) hideBtn.style.display = "none";
      if (showBtn) showBtn.style.display = "inline-block";

      if (emojiPickerContainer.style.display === "block") {
        emojiPickerContainer.style.display = "none";
      } else {
        emojiPickerContainer.style.display = "block";
      }
    });

    if (emojiPickerElement) {
      emojiPickerElement.addEventListener("emoji-click", function (e) {
        if (e.detail && e.detail.unicode && contentTextarea) {
          const start = contentTextarea.selectionStart;
          const end = contentTextarea.selectionEnd;
          const text = contentTextarea.value;
          const emoji = e.detail.unicode;
          contentTextarea.value = text.substring(0, start) + emoji + text.substring(end);
          const newPos = start + emoji.length;
          contentTextarea.selectionStart = newPos;
          contentTextarea.selectionEnd = newPos;
          contentTextarea.focus();
        }
      });
    }

    emojiPickerContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    emojiPickerBtn.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.addEventListener("click", function (e) {
      if (!emojiPickerContainer.contains(e.target) && e.target !== emojiPickerBtn && !emojiPickerBtn.contains(e.target)) {
        emojiPickerContainer.style.display = "none";
      }
    });
  }

  window.searchWishSuggestionsFunction = function () {
    const input = document.getElementById("searchWishSuggestions");
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("wishSuggestions");
    const li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
      const a = li[i].getElementsByTagName("a")[0];
      const txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  function init() {
    initWishAutocomplete();
    initEmojiPicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
