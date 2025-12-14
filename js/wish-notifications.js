// Display random wish notifications on page load
// Depends on Firebase globals set in index.html (window.firebaseDB, collection, getDocs, query, orderBy, limit)

import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function createNotificationContainer() {
  const existing = document.getElementById("wishNotificationContainer");
  if (existing) return existing;
  const container = document.createElement("div");
  container.className = "wish-notification-container";
  container.id = "wishNotificationContainer";
  document.body.appendChild(container);
  return container;
}

function showWishNotification(wish, container, onClose) {
  const oldNotification = container.querySelector(".wish-notification");
  if (oldNotification) {
    oldNotification.classList.add("fade-out");
    setTimeout(() => oldNotification.remove(), 600);
  }

  const notification = document.createElement("div");
  notification.className = "wish-notification";

  const name = wish.name || "Khách mời";
  const message = wish.content || "";

  notification.innerHTML = `
    <div class="wish-notification-header">
      <div class="wish-notification-name">
        <span>💌</span>
        <span>${name}</span>
      </div>
      <button class="wish-notification-close" aria-label="Đóng">&times;</button>
    </div>
    <div class="wish-notification-message">${message}</div>
  `;

  setTimeout(
    () => {
      container.appendChild(notification);

      const closeBtn = notification.querySelector(".wish-notification-close");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notification.classList.add("fade-out");
        setTimeout(() => {
          notification.remove();
          if (onClose) onClose();
        }, 600);
      });

      notification.addEventListener("click", () => {
        const rsvpSection = document.getElementById("rsvp");
        if (rsvpSection) {
          const header = document.querySelector(".navbar-fixed-top");
          const headerOffset = header ? header.offsetHeight : 0;
          const targetPosition = rsvpSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
          notification.classList.add("fade-out");
          setTimeout(() => {
            notification.remove();
            if (onClose) onClose();
          }, 600);
        }
      });
    },
    oldNotification ? 600 : 0
  );
}

async function loadAndShowWishes() {
  try {
    const db = window.firebaseDB;
    if (!db) {
      console.log("Firebase chưa sẵn sàng");
      return;
    }

    const wishesRef = collection(db, "wishes");
    const q = query(wishesRef, orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const wishes = [];
    querySnapshot.forEach((doc) => wishes.push({ id: doc.id, ...doc.data() }));

    if (wishes.length === 0) {
      console.log("Chưa có lời chúc nào");
      return;
    }

    const container = createNotificationContainer();
    const shuffled = [...wishes].sort(() => 0.5 - Math.random());
    const selectedWishes = shuffled.slice(0, 3);

    let isStopped = false;
    let nextTimeout = null;
    let currentIndex = 0;

    function showNext() {
      if (isStopped || currentIndex >= selectedWishes.length) return;

      showWishNotification(selectedWishes[currentIndex], container, () => {
        isStopped = true;
        if (nextTimeout) clearTimeout(nextTimeout);
        container.remove();
      });

      currentIndex++;

      if (currentIndex < selectedWishes.length) {
        nextTimeout = setTimeout(showNext, 5000);
      } else {
        nextTimeout = setTimeout(() => {
          if (!isStopped) {
            const lastNotification = container.querySelector(".wish-notification");
            if (lastNotification) {
              lastNotification.classList.add("fade-out");
              setTimeout(() => {
                lastNotification.remove();
                container.remove();
              }, 600);
            }
          }
        }, 5000);
      }
    }

    showNext();
  } catch (error) {
    console.error("Lỗi khi load lời chúc:", error);
  }
}

// Delay a bit after load so the page settles
window.addEventListener("load", () => {
  setTimeout(loadAndShowWishes, 2000);
});

export {};
