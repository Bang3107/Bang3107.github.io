document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("wedding-calendar");
  if (!calendarContainer) return;

  const weddingDate = 26;

  // Lunar dates for Feb 2026
  // Feb 1 is 14/12 AL
  const lunarDates = [
    "14/12",
    "15/12",
    "16/12",
    "17/12",
    "18/12",
    "19/12",
    "20/12",
    "21/12",
    "22/12",
    "23/12",
    "24/12",
    "25/12",
    "26/12",
    "27/12",
    "28/12",
    "29/12",
    "1/1",
    "2/1",
    "3/1",
    "4/1",
    "5/1",
    "6/1",
    "7/1",
    "8/1",
    "9/1",
    "10/1",
    "11/1",
    "12/1",
  ];

  const daysInMonth = 28; // Feb 2026
  const firstDayOfWeek = 0; // Feb 1 2026 is Sunday (0)

  let html = `
        <div class="calendar-header">
            <h3>Tháng 2 / 2026</h3>
        </div>
        <div class="calendar-weekdays">
            <div>CN</div><div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div>
        </div>
        <div class="calendar-days">
    `;

  // Empty slots for previous month (if any)
  for (let i = 0; i < firstDayOfWeek; i++) {
    html += `<div class="day empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isWeddingDay = day === weddingDate;
    const lunar = lunarDates[day - 1];
    const className = isWeddingDay ? "day wedding-day" : "day";
    // const heartIcon = isWeddingDay ? '<span style="color: #d65d5d; font-size: 12px; position: absolute; top: 2px; right: 2px;">❤️</span>' : '';

    html += `
            <div class="${className}">
                <span class="solar-date">${day}</span>
                <span class="lunar-date">${lunar}</span>
            </div>
        `;
  }

  html += `</div>`;
  calendarContainer.innerHTML = html;
});
