// Global analytics configuration
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "G-K9L0ZFE1PJ");

// Smooth scroll for menu anchors (home, cặp đôi, ...)
(function () {
  function getHeaderOffset() {
    var header = document.querySelector(".navbar-fixed-top");
    return header ? header.offsetHeight : 0;
  }
  function isHashLink(el) {
    return el && el.tagName === "A" && el.getAttribute("href") && el.getAttribute("href").startsWith("#");
  }
  function findTarget(hash) {
    try {
      return document.querySelector(hash);
    } catch (_) {
      return null;
    }
  }
  function smoothScrollTo(target) {
    var headerOffset = getHeaderOffset();
    var rect = target.getBoundingClientRect();
    var targetY = rect.top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }
  document.addEventListener("click", function (e) {
    var el = e.target;
    while (el && el !== document && el.tagName !== "A") el = el.parentNode;
    if (!isHashLink(el)) return;
    var href = el.getAttribute("href");
    if (href === "#" || href === "") return;
    var target = findTarget(href);
    if (target) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });
  window.addEventListener("load", function () {
    if (location.hash) {
      var target = findTarget(location.hash);
      if (target) {
        setTimeout(function () {
          smoothScrollTo(target);
        }, 50);
      }
    }
  });
})();

// Open donate modal when navigating to #donate
(function () {
  function openDonateIfHash() {
    if (location.hash === "#donate") {
      var modal = document.getElementById("donate-modal");
      if (modal) {
        modal.style.display = "block";
      }
    }
  }
  window.addEventListener("hashchange", openDonateIfHash);
  window.addEventListener("load", openDonateIfHash);
  document.addEventListener("click", function (e) {
    var el = e.target;
    while (el && el !== document && el.tagName !== "A") el = el.parentNode;
    if (el && el.tagName === "A" && el.getAttribute("href") === "#donate") {
      setTimeout(openDonateIfHash, 350);
    }
  });
})();

// Enhanced scroll-based active menu highlighting using IntersectionObserver
(function () {
  function setActiveMenuItem(sectionId) {
    const allMenuItems = document.querySelectorAll(".navbar-nav > li");
    allMenuItems.forEach(function (li) {
      li.classList.remove("active");
    });

    const activeLink = document.querySelector('.navbar-nav a[href="#' + sectionId + '"]');
    if (activeLink) {
      const parentLi = activeLink.parentElement;
      if (parentLi && parentLi.tagName === "LI") {
        parentLi.classList.add("active");
      }
    }
  }

  function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const menuLinks = Array.from(document.querySelectorAll(".navbar-nav a[href^='#']"));
    const sectionIds = menuLinks
      .map(function (link) {
        const href = link.getAttribute("href");
        return href && href !== "#" ? href.substring(1) : null;
      })
      .filter(Boolean);

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          setActiveMenuItem(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      if (sectionIds.includes(section.id)) {
        observer.observe(section);
      }
    });

    setTimeout(function () {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollPos < 100) {
        setActiveMenuItem("wd-banner");
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollSpy);
  } else {
    initScrollSpy();
  }

  window.addEventListener("load", function () {
    setTimeout(initScrollSpy, 300);
  });
})();

// Global data holders
window.photoGalleries = window.photoGalleries || [];
window.dataWishes = window.dataWishes || [];

// Heart rain effect
(function () {
  let heartCount = 0;
  const maxHearts = 160;
  const spawnInterval = 850;
  let isScrolling = false;
  let scrollCooldownTimer = null;
  let cachedDocHeight = 0;
  let spawner = null;

  function onScrollActivity() {
    isScrolling = true;
    clearTimeout(scrollCooldownTimer);
    scrollCooldownTimer = setTimeout(() => (isScrolling = false), 200);
  }
  window.addEventListener("scroll", onScrollActivity, { passive: true });
  window.addEventListener("wheel", onScrollActivity, { passive: true });
  window.addEventListener("touchmove", onScrollActivity, { passive: true });

  function updateDocHeight() {
    const docEl = document.documentElement;
    const body = document.body;
    cachedDocHeight = Math.max(docEl.scrollHeight || 0, body ? body.scrollHeight : 0, docEl.clientHeight || 0, body ? body.clientHeight : 0);
  }
  window.addEventListener("resize", updateDocHeight);
  window.addEventListener("orientationchange", updateDocHeight);

  function createHeartNode() {
    const img = document.createElement("img");
    const size = 25 + Math.random() * 15;
    const svgs = ["./anh/heart.svg"];
    img.src = svgs[Math.floor(Math.random() * svgs.length)];
    img.width = size;
    img.height = size;
    img.className = "global-heart";
    return img;
  }

  function spawnFallingHeart() {
    if (isScrolling || heartCount >= maxHearts) return;

    heartCount++;
    const heart = createHeartNode();
    const docEl = document.documentElement;
    const docW = docEl.clientWidth || window.innerWidth;
    const docH = cachedDocHeight || Math.max(docEl.scrollHeight || 0, document.body.scrollHeight || 0);

    const heartSize = parseFloat(heart.getAttribute("height")) || 26;
    const startX = Math.random() * (docW - heartSize);
    const startY = 0;
    const endY = docH - heartSize;

    const minSpeed = 50;
    const maxSpeed = 150;
    const speedPxPerSec = minSpeed + Math.random() * (maxSpeed - minSpeed);

    const distance = endY - startY;
    const duration = (distance / speedPxPerSec) * 1000;

    const rotate = Math.random() * 360;
    const driftAmount = (Math.random() - 0.5) * 80;

    const isHeart1 = heart.src && heart.src.includes("heart1.svg");

    heart.style.transform = `translate3d(${startX}px,${startY}px,0) rotate(${isHeart1 ? 0 : rotate}deg)`;
    heart.style.opacity = "0.8";
    document.body.appendChild(heart);

    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / duration);
      const x = isHeart1 ? startX : startX + driftAmount * Math.sin(progress * Math.PI * 4);
      const y = startY + (endY - startY) * progress + (isHeart1 ? 0 : Math.sin(progress * Math.PI * 4) * 10);
      const rotateStep = isHeart1 ? 0 : rotate + progress * 180;
      const opacity = progress > 0.7 ? (1 - (progress - 0.7) / 0.3) * 0.8 : 0.8;

      heart.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rotateStep}deg)`;
      heart.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
        heartCount--;
      }
    }
    requestAnimationFrame(step);
  }

  function animatePrefilledHeart(heart, startX, startY, docH, heartSize) {
    const speedPxPerSec = 50;
    const endY = docH - heartSize;
    const distance = endY - startY;
    const duration = (distance / speedPxPerSec) * 1000;
    const driftAmount = (Math.random() - 0.5) * 80;
    const rotateStart = Math.random() * 360;
    const isHeart1 = heart.src && heart.src.includes("heart1.svg");
    let startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(1, elapsed / duration);
      const x = isHeart1 ? startX : startX + driftAmount * Math.sin(progress * Math.PI * 4);
      const y = startY + (endY - startY) * progress;
      const rot = isHeart1 ? 0 : rotateStart + progress * 180;
      heart.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg)`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
        heartCount--;
      }
    }

    requestAnimationFrame(step);
  }

  function prefillHearts(amount) {
    for (let i = 0; i < amount; i++) {
      const heart = createHeartNode();
      const docEl = document.documentElement;
      const docW = docEl.clientWidth || window.innerWidth;
      const docH = cachedDocHeight || Math.max(docEl.scrollHeight || 0, document.body.scrollHeight || 0);
      const heartSize = parseFloat(heart.getAttribute("height")) || 26;
      const x = Math.random() * (docW - heartSize);
      const y = Math.random() * (docH - heartSize);
      heart.style.transform = `translate3d(${x}px,${y}px,0)`;
      heart.style.opacity = 0.8;
      document.body.appendChild(heart);
      heartCount++;
      requestAnimationFrame(() => animatePrefilledHeart(heart, x, y, docH, heartSize));
    }
  }

  function startHeartRain() {
    if (spawner) return;
    updateDocHeight();
    spawner = setInterval(spawnFallingHeart, spawnInterval);
  }

  function stopHeartRain() {
    if (spawner) {
      clearInterval(spawner);
      spawner = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopHeartRain();
    else startHeartRain();
  });

  window.addEventListener("load", () => {
    updateDocHeight();
    prefillHearts(50);
    setTimeout(startHeartRain, 500);
  });

  window.startHeartRain = startHeartRain;
  window.stopHeartRain = stopHeartRain;
})();

// Utility + global configuration
function sanitizeJsonString(jsonString) {
  return jsonString.replace(/[\n\r\t]/g, "").replace(/,(\s*[}\]])/g, "$1");
}
function parseJsonRecursively(jsonString) {
  const sanitizedString = sanitizeJsonString(jsonString);
  const parsed = JSON.parse(sanitizedString);
  Object.keys(parsed).forEach(function (key) {
    try {
      const checkValue = JSON.parse(parsed[key]);
      if (checkValue && checkValue.constructor === Object) {
        parsed[key] = checkValue;
      }
    } catch (e) {
      // ignore
    }
  });
  return parsed;
}

window.biicore = parseJsonRecursively(
  '{"template_id":"62ef3cfd4c248a18ec5a9b5a","templatePremium":false,"themeRoot":"https://preview.iwedding.info/templates/template18","webroot":"https://preview.iwedding.info","coreSite":"https://biihappy.com","webToken":"61990349db8f76231c132068","isPremium":true,"bgMusic":"https://cdn.biihappy.com/ziiweb/wedding-musics/IDo-911.mp3","alert":{"title":"L\u1eddi c\u1ea3m \u01a1n t\u1eeb D\u00e2u &amp; R\u1ec3","content":"Xin ch\u00e2n th\u00e0nh c\u1ea3m \u01a1n to\u00e0n th\u1ec3 m\u1ecdi ng\u01b0\u1eddi \u0111\u00e3 g\u1eedi l\u1eddi ch\u00fac cho v\u1ee3 ch\u1ed3ng ch\u00fang em!","timeout":5000,"status":2,"cancel_button_text":""},"effect":"{\\"type\\":\\"flower8\\"}","logo":"https://iwedding.info/common/imgs/bii.png?v=20210131","url_landing_page":"https://biihappy.com/iwedding","isAutoPlay":true,"footer_title":"iWedding | N\u1ec1n t\u1ea3ng t\u1ea1o website \u0111\u00e1m c\u01b0\u1edbi mi\u1ec5n ph\u00ed t\u1eeb Biihappy","footer_title_mobile":"T\u1ea1o website \u0111\u00e1m c\u01b0\u1edbi mi\u1ec5n ph\u00ed"}',
);

const siteConfig = {
  bride: {
    name: "Phạm Minh Tâm",
    fullName: "Phạm Minh Tâm",
    facebook: "https://www.facebook.com/to.mo.28072002",
    instagram: "https://www.instagram.com/mita_pmt/",
  },
  groom: {
    name: "Nguyễn Chương Trung",
    fullName: "Nguyễn Chương Trung",
    facebook: "https://www.facebook.com/trung.chuong.526",
    instagram: "https://www.instagram.com/trung.nct/",
  },
  weddingDate: "2026-02-26",
  music: {
    //  src: "https://cdn.biihappy.com/ziiweb/wedding-musics/IDo-911.mp3",
    src: "/anh/tromvia.mp3",
    autoPlay: true,
  },
};
window.siteConfig = siteConfig;
