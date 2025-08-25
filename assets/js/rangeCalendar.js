let selectedDates = []; // array global para armazenar as datas escolhidas
let removedDates = []; // array para armazenar as datas removidas manualmente
let datasAtivas = []; // array para armazenar as datas formatadas ativas

function getDateRange(start, end) {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function renderTags() {
  document.querySelectorAll(".day-column").forEach((col) => (col.innerHTML = ""));

  selectedDates.forEach((d, idx) => {
    const dow = d.getDay(); 
    const column = document.querySelector(`.day-column[data-day="${dow}"]`);

    const isRemoved = removedDates.some((rd) => rd.getTime() === d.getTime());

    const tag = document.createElement("div");
    tag.className = `
      flex items-center justify-between gap-1 px-2 py-1 rounded text-[0.75rem] font-bold 
      ${isRemoved ? "bg-red-400 text-white" : "bg-[#8d69e9] text-white"}
    `;

    tag.innerHTML = `
      <span>${d.getDate()}/${d.getMonth() + 1}</span>
      <button class="font-bold" data-index="${idx}">✕</button>
    `;

    column.appendChild(tag);
  });

  // evento de remoção
  document.querySelectorAll(".day-column button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.dataset.index, 10);
      const date = selectedDates[index];

      if (!removedDates.some((rd) => rd.getTime() === date.getTime())) {
        removedDates.push(date);
      } else {
        removedDates = removedDates.filter(
          (rd) => rd.getTime() !== date.getTime()
        );
      }

      renderTags();
      highlightDates();
    });
  });
}

function highlightDates() {
  window.rangeCalendar.getEvents().forEach((ev) => ev.remove());

  selectedDates.forEach((date) => {
    const isRemoved = removedDates.some((rd) => rd.getTime() === date.getTime());

    window.rangeCalendar.addEvent({
      start: date,
      allDay: true,
      display: "background",
      backgroundColor: isRemoved ? "#dc2626" : "#2563eb", 
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const rangeEl = document.getElementById("rangeCalendar");

  window.rangeCalendar = new FullCalendar.Calendar(rangeEl, {
    initialView: "dayGridMonth",
    selectable: true,
    locale: "pt-br",
    headerToolbar: {
      left: "title",
      right: "prev,next",
    },
    buttonIcons: {
      prev: "bi bi-arrow-left-short",
      next: "bi bi-arrow-right-short",
    },
    dayHeaderFormat: { weekday: "short" },
    dayHeaderContent: (arg) => arg.text.charAt(0),

    select: function (info) {
      const start = new Date(info.start);
      const end = new Date(info.end);
      end.setDate(end.getDate() - 1);

      selectedDates = getDateRange(start, end);
      removedDates = [];
      renderTags();
      highlightDates();
    },
  });

  window.rangeCalendar.render();

  // BOTÃO "Salvar Seleção"
  document.getElementById("saveSelection").addEventListener("click", () => {
    const activeDates = selectedDates.filter(
      d => !removedDates.some(rd => rd.getTime() === d.getTime())
    );

    // converter para formato YYYY-MM-DD
    const formattedActive = activeDates.map(d => 
      d.toISOString().split("T")[0]
    );

    const formattedRemoved = removedDates.map(d =>
      d.toISOString().split("T")[0]
    );

    console.log("Datas ativas:", formattedActive);
    console.log("Datas removidas:", formattedRemoved);
    datasAtivas = formattedActive;
    

    alert(`Datas selecionadas:\n${formattedActive.join(", ")}`);
  });
});
