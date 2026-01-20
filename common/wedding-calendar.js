document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("wedding-calendar");
  if (!calendarContainer) return;

  const weddingDate = 26;

  // Lunar dates for Feb 2026
  // Feb 1 is 14/12 AL
  const lunarDates = [
    "14/12",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "1/1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const daysInMonth = 28; // Feb 2026
  const firstDayOfWeek = 0; // Feb 1 2026 is Sunday (0)

  let html = `
        <div class="calendar-header">
            <h3>Tháng 2 / 2026</h3>
        </div>
        <div class="calendar-weekdays">
            <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div class="sunday">CN</div>
        </div>
        <div class="calendar-days">
    `;

  // Empty slots for previous month (Monday-first format)
  const emptySlots = (firstDayOfWeek + 6) % 7;
  for (let i = 0; i < emptySlots; i++) {
    html += `<div class="day empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isWeddingDay = day === weddingDate;
    const isTetEve = day === 17; // Giao thừa Tết Nguyên Đán
    const lunar = lunarDates[day - 1];
    
    // Calculate day of week (Monday-first: 0=Mon, 6=Sun)
    const dayOfWeekMonFirst = (firstDayOfWeek + day - 1 + 6) % 7;
    const isSunday = dayOfWeekMonFirst === 6;
    
    let className = "day";
    if (isWeddingDay) className += " wedding-day";
    if (isSunday) className += " sunday";
    
    const tetIcon = isTetEve ? '<span class="tet-icon" style="position: absolute; top: 2px; right: 2px; font-size: 14px;">🎆</span>' : '';

    html += `
            <div class="${className}">
                ${tetIcon}
                <span class="solar-date">${day}</span>
                <span class="lunar-date">${lunar}</span>
            </div>
        `;
  }

  html += `</div>`;
  calendarContainer.innerHTML = html;
});
