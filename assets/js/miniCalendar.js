function enableWeekHover(miniCalendarEl) {
  const weekRows = miniCalendarEl.querySelectorAll(".fc-daygrid-body tr");

  weekRows.forEach((row) => {
    const cells = row.querySelectorAll("td");

    cells.forEach((cell) => {
      cell.addEventListener("mouseenter", () => {
        row.classList.add("bg-gray-200");
      });
      cell.addEventListener("mouseleave", () => {
        row.classList.remove("bg-gray-200");
      });
      cell.addEventListener("click", () => {
        weekRows.forEach((r) => r.classList.remove("bg-blue-200", "bg-gray-200", "shadow-[inset_0px_0px_5px_#5750e2]"));
        row.classList.add("bg-blue-200", "shadow-[inset_0px_0px_5px_#5750e2]");
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const miniEl = document.getElementById("miniCalendar");

  window.miniCalendar = new FullCalendar.Calendar(miniEl, {
    initialView: "dayGridMonth",
    selectable: true,
    locale: "pt-br",
    headerToolbar: {
      left: "title",
      right: "next,prev",
    },
      buttonIcons: {
      prev: 'bi bi-arrow-down-short',  // Bootstrap icon para "anterior"
      next: 'bi bi-arrow-up-short', // Bootstrap icon para "próximo"
    },
    dayHeaderFormat: {
        weekday: 'short' // já retorna abreviação curta (Sun, Mon, etc.)
    },
    dayHeaderContent: function(arg) {
        // Retorna apenas a primeira letra
        return arg.text.charAt(0);
    },
    dateClick: function (info) {
      const startOfWeek = new Date(info.date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // domingo

      // garante que mainCalendar está pronto
      if (window.mainCalendar) {
        window.mainCalendar.changeView("timeGridWeek");
        window.mainCalendar.gotoDate(startOfWeek);
      } else {
        console.warn("mainCalendar não está inicializado ainda");
      }
    },
    datesSet: function() {
    // reaplica hover toda vez que a view ou mês muda
    enableWeekHover(miniEl);
  }
  });

// Depois de renderizar o mini calendário
    window.miniCalendar.render();
    enableWeekHover(miniEl);
});