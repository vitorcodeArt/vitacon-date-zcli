document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("mainCalendar");

  // cria o popup (inicialmente oculto)
  const popup = document.createElement("div");
  popup.className =
    "absolute hidden bg-white shadow-lg rounded-lg p-3 text-sm border border-gray-300 z-50 pointer-events-none";
  popup.style.minWidth = "200px";
  document.body.appendChild(popup);

  window.mainCalendar = new FullCalendar.Calendar(calendarEl, {
    // torne global
    themeSystem: "bootstrap5",
    initialView: "dayGridMonth",
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

          // popula status
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

          fillDropdown("filterStatus", statusSet);
          fillDropdown("filterEmpreendimento", empreendimentoSet);
          fillDropdown("filterTipo", tipoSet);

          document.getElementById("filterModal").classList.remove("hidden");
        },
      },
    },

    headerToolbar: {
      left: "prev,next today filterClass",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },

    dateClick: function (info) {
      let titulo = prompt("Digite o título do evento:");
      if (titulo) {
        window.mainCalendar.addEvent({
          title: titulo,
          start: info.date,
          allDay: true,
          backgroundColor: getRandomColor(),
        });
      }
    },

    eventClick: function (info) {
      let ticketId = info.event.extendedProps.ticketId;
      if (ticketId) {
        let url = `https://con-bcrcx-fabio.zendesk.com/agent/tickets/${ticketId}`;
        window.open(url, "_blank");
      }
    },

    eventMouseEnter: function (info) {
      // Se já existir um popup, mata a animação e remove
      const existingPopup = document.querySelector("#event-popup");
      if (existingPopup) {
        gsap.killTweensOf(existingPopup); // mata animações antigas
        existingPopup.remove();
      }

      // Cria o popup
      const popup = document.createElement("div");
      popup.id = "event-popup";
      popup.className =
        "fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm pointer-events-none";
      popup.style.opacity = 0;

      popup.innerHTML = `
    <p><strong>Título:</strong> ${info.event.title}</p>
    <p><strong>ID:</strong> ${info.event.id || "N/A"}</p>
    <p><strong>Status:</strong> ${
      info.event.extendedProps.status || "Aberto"
    }</p>
    <p><strong>Tipo:</strong> ${info.event.extendedProps.tipo || "Padrão"}</p>
    <p><strong>Empreendimento:</strong> ${
      info.event.extendedProps.empreendimento || "N/A"
    }</p>
  `;

      document.body.appendChild(popup);

      // Anima entrada
      gsap.fromTo(
        popup,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.2 }
      );

      // Atualiza posição conforme o mouse
      const moveHandler = (e) => {
        gsap.set(popup, { x: e.pageX + 15, y: e.pageY + 15 });
      };

      document.addEventListener("mousemove", moveHandler);

      // Salva referência para poder remover depois
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

  // ================================
  // 🔹 Busca tickets do Zendesk
  // ================================

  const FIELDS_MAP = {
    39804354708123: "tipo",
    39880756544539: "empreendimento",
    39880638747163: "horario",
    39804409012763: "agendamento",
    39880698235803: "status",
  };

  client
    .request({
      url: `/api/v2/search.json?query=type:ticket ticket_form_id:39804179516187`,
      type: "GET",
    })
    .then(function (data) {
      const tickets = data.results.map((ticket) => {
        let custom = {};
        for (let fieldId in FIELDS_MAP) {
          const field = ticket.fields?.find((f) => f.id == fieldId);
          custom[FIELDS_MAP[fieldId]] = field ? field.value : null;
        }
        return {
          id: ticket.id,
          ...custom,
        };
      });

      console.log(tickets)

      tickets.forEach((ticket) => {
        if (!ticket.agendamento) return;
        let startDate = ticket.agendamento;
        if (ticket.horario) startDate = `${startDate}T${ticket.horario}`;

        window.mainCalendar.addEvent({
          id: ticket.id,
          title: `Ticket ${ticket.id}`,
          start: startDate,
          backgroundColor: getGroupColor(ticket.status),
          classNames: [ticket.tipo, ticket.empreendimento],
          extendedProps: {
            ticketId: ticket.id,
            status: ticket.status,
            empreendimento: ticket.empreendimento,
            tipo: ticket.tipo,
          },
        });
      });
    })
    .catch(console.error);

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
      opt.textContent = val;
      opt.setAttribute("data-value", val);
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

  function getGroupColor(status) {
    if (status === "vita_agenda_status_agendado") return "#FF6B6B";
    if (status === "vita_agenda_status_livre") return "#4ECDC4";
  }

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

  document.getElementById("closeFilter").addEventListener("click", function () {
    document.getElementById("filterModal").classList.add("hidden");
  });

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
});
