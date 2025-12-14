(function () {
  "use strict";

  function showCalendarCheckmark(buttonId, modalId) {
    var button = document.getElementById(buttonId);
    if (button) {
      var checkmark = button.querySelector(".calendar-checkmark");
      if (checkmark) {
        checkmark.style.display = "inline";
      }
    }
    closeCalendarModal(modalId);
  }

  function openCalendarModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeCalendarModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var modals = document.querySelectorAll(".calendar-modal");
      modals.forEach(function (m) {
        m.style.display = "none";
        document.body.style.overflow = "";
      });
    }
  });

  function downloadICSFile(title, date, startTime, endTime, location, description, buttonId, modalId) {
    var startDateTime = date.replace(/-/g, "") + "T" + startTime.replace(/:/g, "") + "00";
    var endDateTime = date.replace(/-/g, "") + "T" + endTime.replace(/:/g, "") + "00";
    var icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:" + startDateTime,
      "DTEND:" + endDateTime,
      "SUMMARY:" + title,
      "DESCRIPTION:" + description,
      "LOCATION:" + location,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    var blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "wedding-event.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (buttonId && modalId) {
      showCalendarCheckmark(buttonId, modalId);
    }
  }

  function addToGoogleCalendar(title, date, startTime, endTime, location, description, buttonId, modalId) {
    var start = date.replace(/-/g, "") + "T" + startTime.replace(/:/g, "") + "00";
    var end = date.replace(/-/g, "") + "T" + endTime.replace(/:/g, "") + "00";
    var url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" +
      encodeURIComponent(title) +
      "&dates=" +
      start +
      "/" +
      end +
      "&details=" +
      encodeURIComponent(description) +
      "&location=" +
      encodeURIComponent(location);
    window.open(url, "_blank");
    if (buttonId && modalId) {
      showCalendarCheckmark(buttonId, modalId);
    }
  }

  function addToAppleCalendar(title, date, startTime, endTime, location, description, buttonId, modalId) {
    downloadICSFile(title, date, startTime, endTime, location, description, buttonId, modalId);
  }

  function addToOutlookCalendar(title, date, startTime, endTime, location, description, buttonId, modalId) {
    var start = date + "T" + startTime + ":00";
    var end = date + "T" + endTime + ":00";
    var url =
      "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
      "&subject=" +
      encodeURIComponent(title) +
      "&startdt=" +
      encodeURIComponent(start) +
      "&enddt=" +
      encodeURIComponent(end) +
      "&body=" +
      encodeURIComponent(description) +
      "&location=" +
      encodeURIComponent(location);
    window.open(url, "_blank");
    if (buttonId && modalId) {
      showCalendarCheckmark(buttonId, modalId);
    }
  }

  function addToYahooCalendar(title, date, startTime, endTime, location, description, buttonId, modalId) {
    var start = date.replace(/-/g, "") + "T" + startTime.replace(/:/g, "") + "00";
    var end = date.replace(/-/g, "") + "T" + endTime.replace(/:/g, "") + "00";
    var url =
      "https://calendar.yahoo.com/?v=60&view=d&type=20" +
      "&title=" +
      encodeURIComponent(title) +
      "&st=" +
      start +
      "&et=" +
      end +
      "&desc=" +
      encodeURIComponent(description) +
      "&in_loc=" +
      encodeURIComponent(location);
    window.open(url, "_blank");
    if (buttonId && modalId) {
      showCalendarCheckmark(buttonId, modalId);
    }
  }

  // Expose helpers globally if needed
  window.showCalendarCheckmark = showCalendarCheckmark;
  window.openCalendarModal = openCalendarModal;
  window.closeCalendarModal = closeCalendarModal;
  window.downloadICSFile = downloadICSFile;
  window.addToGoogleCalendar = addToGoogleCalendar;
  window.addToAppleCalendar = addToAppleCalendar;
  window.addToOutlookCalendar = addToOutlookCalendar;
  window.addToYahooCalendar = addToYahooCalendar;
})();
