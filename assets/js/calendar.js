import { fetchTickets, getFields, VALUE_LABEL_MAP } from "./ticketsService.js";

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("mainCalendar");

  window.mainCalendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: "bootstrap5",
    initialView: "timeGridWeek",
    locale: "pt-br",
    selectable: true,
    editable: true,
    droppable: true,
    dayMaxEventRows: true,
    allDaySlot: false,
    slotDuration: "01:00:00",
    expandRows: true,
    eventMinHeight: 30,
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",

    customButtons: {
      filterClass: {
        text: "Filtrar",
        click: function () {
          const allEvents = window.mainCalendar.getEvents();

          const statusSet = new Set();
          const empreendimentoSet = new Set();
          const tipoSet = new Set();

          allEvents.forEach((event) => {
            if (event.extendedProps.status)
              statusSet.add(event.extendedProps.status);
            if (event.extendedProps.empreendimento)
              empreendimentoSet.add(event.extendedProps.empreendimento);
            if (event.extendedProps.tipo) tipoSet.add(event.extendedProps.tipo);
          });

          const statusArr = Array.from(statusSet);
          const empreendimentoArr = Array.from(empreendimentoSet);
          const tipoArr = Array.from(tipoSet);

          fillDropdown(
            "filterStatus",
            statusArr.map((val) => ({
              id: val,
              title: VALUE_LABEL_MAP[val] || val,
            }))
          );

          fillDropdown("filterEmpreendimento", empreendimentoArr);
          fillDropdown(
            "filterTipo",
            tipoArr.map((val) => ({
              id: val,
              title: VALUE_LABEL_MAP[val] || val,
            }))
          );

          document.getElementById("filterModal").classList.remove("hidden");
        },
      },
    },

    headerToolbar: {
      left: "",
      center: "title",
      right: "prev,next filterClass timeGridWeek,listWeek",
    },

    titleFormat: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },

    // 🔹 Eventos filtrados por semana
    events: async function (info, successCallback, failureCallback) {
      try {
        // info.start e info.end já vêm no formato Date
        const startOfWeek = info.start.toISOString().slice(0, 10);
        const endOfWeek = info.end.toISOString().slice(0, 10);

        const tickets = await fetchTickets(startOfWeek, endOfWeek);

        successCallback(tickets);
      } catch (err) {
        failureCallback(err);
      }
    },

    eventClick: function (info) {
      let ticketId = info.event.extendedProps.ticketId;
      if (ticketId) {
        let url = `https://con-bcrcx-fabio.zendesk.com/agent/tickets/${ticketId}`;
        window.open(url, "_blank");
      }
    },

    eventsSet: function (events) {
      console.log("Calendário atualizado. Total de eventos:", events.length);
    },

    eventMouseEnter: function (info) {
      const existingPopup = document.querySelector("#event-popup");
      if (existingPopup) {
        gsap.killTweensOf(existingPopup);
        existingPopup.remove();
      }

      const popup = document.createElement("div");
      popup.id = "event-popup";
      popup.className =
        "fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm pointer-events-none";
      popup.style.opacity = 0;

      const statusLabel =
        VALUE_LABEL_MAP[info.event.extendedProps.status] ||
        info.event.extendedProps.status ||
        "Aberto";
      const tipoLabel =
        VALUE_LABEL_MAP[info.event.extendedProps.tipo] ||
        info.event.extendedProps.tipo ||
        "Padrão";

      popup.innerHTML = `
        <p><strong>Título:</strong> ${info.event.title}</p>
        <p><strong>ID:</strong> ${info.event.id || "N/A"}</p>
        <p><strong>Status:</strong> ${statusLabel}</p>
        <p><strong>Tipo:</strong> ${tipoLabel}</p>
        <p><strong>Empreendimento:</strong> ${
          info.event.extendedProps.empreendimento || "N/A"
        }</p>
      `;

      document.body.appendChild(popup);

      gsap.fromTo(
        popup,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2 }
      );

      const moveHandler = (e) => {
        gsap.set(popup, { x: e.pageX + 15, y: e.pageY + 15 });
      };

      document.addEventListener("mousemove", moveHandler);

      info.el._popup = popup;
      info.el._moveHandler = moveHandler;
    },

    eventMouseLeave: function (info) {
      const popup = info.el._popup;
      if (popup) {
        gsap.to(popup, {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          onComplete: () => {
            if (popup && popup.parentNode) {
              popup.remove();
            }
          },
        });
      }

      if (info.el._moveHandler) {
        document.removeEventListener("mousemove", info.el._moveHandler);
      }
    },
  });

  window.mainCalendar.render();

  //  Quando precisar atualizar os eventos (ex: ao salvar um ticket):

  // ================================
  // 🔹 Funções utilitárias
  // ================================

  function fillDropdown(dropdownId, values) {
    const dropdown = document.getElementById(dropdownId);
    const optionsContainer = dropdown.querySelector(".options");
    const selected = dropdown.querySelector(".selected");

    optionsContainer.innerHTML = "";
    const defaultOpt = document.createElement("div");
    defaultOpt.textContent = "Todos";
    defaultOpt.setAttribute("data-value", "");
    defaultOpt.className = "p-2 cursor-pointer hover:bg-gray-100 transition";
    optionsContainer.appendChild(defaultOpt);

    values.forEach((val) => {
      const opt = document.createElement("div");

      // se for objeto, pega o title; senão usa val direto
      const label = val?.title || val;
      const value = val?.id || val;

      opt.textContent = label;
      opt.setAttribute("data-value", value);
      opt.className = "p-2 cursor-pointer hover:bg-gray-100 transition";
      optionsContainer.appendChild(opt);
    });

    optionsContainer.querySelectorAll("div").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        selected.textContent = opt.textContent;
        dropdown.setAttribute("data-value", opt.getAttribute("data-value"));
        optionsContainer.classList.add("hidden");
      });
    });

    if (!dropdown.hasAttribute("data-initialized")) {
      dropdown.addEventListener("click", (e) => {
        if (!e.target.closest(".options")) {
          document
            .querySelectorAll(".options")
            .forEach((opt) => opt.classList.add("hidden"));
          optionsContainer.classList.toggle("hidden");
        }
      });
      dropdown.setAttribute("data-initialized", "true");
    }
  }

  // Inicializa dropdowns com os campos da API
  async function initFilters() {
    try {
      await getFields();

      // // Preenche os filtros com base nos ticket_fields
      // fillDropdown("filterStatus", fields);
      // fillDropdown("filterEmpreendimento", fields);
      // fillDropdown("filterTipo", fields);
    } catch (err) {
      console.error("Erro ao inicializar filtros:", err);
    }
  }
  initFilters();

  // Apply Filter
  document.getElementById("applyFilter").addEventListener("click", function () {
    const status =
      document.getElementById("filterStatus").getAttribute("data-value") || "";
    const empreendimento =
      document
        .getElementById("filterEmpreendimento")
        .getAttribute("data-value") || "";
    const tipo =
      document.getElementById("filterTipo").getAttribute("data-value") || "";

    window.mainCalendar.getEvents().forEach((event) => {
      const matchStatus = !status || event.extendedProps.status === status;
      const matchEmp =
        !empreendimento ||
        event.extendedProps.empreendimento === empreendimento;
      const matchTipo = !tipo || event.extendedProps.tipo === tipo;

      event.setProp(
        "display",
        matchStatus && matchEmp && matchTipo ? "auto" : "none"
      );
    });

    document.getElementById("filterModal").classList.add("hidden");
  });

  // Fecha modal
  document.getElementById("closeFilter").addEventListener("click", function () {
    document.getElementById("filterModal").classList.add("hidden");
  });

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
});

document.getElementById("refreshBtn").onclick = () => {
  window.mainCalendar.refetchEvents();
  console.log("Eventos atualizados");
};
