import {
  fetchDisponibilidades,
  getFields,
  VALUE_LABEL_MAP,
} from "./ticketsService.js";

// ======================
// Pré-carregar dicionários
// ======================
let mapTipoByTitle = {};
let mapEmpreendimentoByTitle = {};
let mapStatusByTitle = {};

async function carregarMapeamentos() {
  try {
    // IDs dos campos
    const idsCampos = {
      empreendimento: "22242038869783",
      tipo: "34533892299671",
      status: "34533890144791",
    };

    // Carrega todos os campos em paralelo
    const [campoEmpreendimento, campoTipo, campoStatus] = await Promise.all([
      client.request({
        url: `/api/v2/ticket_fields/${idsCampos.empreendimento}`,
        type: "GET",
      }),
      client.request({
        url: `/api/v2/ticket_fields/${idsCampos.tipo}`,
        type: "GET",
      }),
      client.request({
        url: `/api/v2/ticket_fields/${idsCampos.status}`,
        type: "GET",
      }),
    ]);

    // Mapeia opções → {title: value}
    campoEmpreendimento.ticket_field.custom_field_options.forEach((opt) => {
      mapEmpreendimentoByTitle[opt.name] = opt.value;
    });

    campoTipo.ticket_field.custom_field_options.forEach((opt) => {
      mapTipoByTitle[opt.name] = opt.value;
    });

    campoStatus.ticket_field.custom_field_options.forEach((opt) => {
      mapStatusByTitle[opt.name] = opt.value;
    });

    console.log("✅ Mapas carregados:");
    console.log("mapEmpreendimentoByTitle:", mapEmpreendimentoByTitle);
    console.log("mapTipoByTitle:", mapTipoByTitle);
    console.log("mapStatusByTitle:", mapStatusByTitle);
  } catch (err) {
    console.error("❌ Erro ao carregar campos do Zendesk:", err);
  }
}

// 🔹 Carrega ao iniciar o app
carregarMapeamentos();

async function loadFieldLabels() {
  try {
    // IDs dos campos de ticket
    const ids = [
      "22242038869783", // empreendimento
      "34533892299671", // tipo
      "34533890144791", // status
      "35064401218455", // objeto personalizado
    ];

    for (let id of ids) {
      const field = await client.request({
        url: `/api/v2/ticket_fields/${id}`,
        type: "GET",
      });

      if (!field?.ticket_field) continue;

      const key = field.ticket_field.title.toLowerCase(); // "Tipo", "Empreendimento", etc.
      const options = field.ticket_field.custom_field_options || [];

      options.forEach((opt) => {
        switch (key) {
          case "tipo":
            mapTipoByTitle[opt.name] = opt.value;
            break;
          case "empreendimento":
            mapEmpreendimentoByTitle[opt.name] = opt.value;
            break;
          case "status":
            mapStatusByTitle[opt.name] = opt.value;
            break;
        }
      });
    }

    console.log("✅ Mapas carregados:");
    console.log("mapTipoByTitle", mapTipoByTitle);
    console.log("mapEmpreendimentoByTitle", mapEmpreendimentoByTitle);
    console.log("mapStatusByTitle", mapStatusByTitle);
  } catch (err) {
    console.error("Erro ao carregar labels dos campos:", err);
  }
}

function mapDisponibilidadesToEvents(disponibilidades) {
  if (!Array.isArray(disponibilidades)) {
    console.error(
      "❌ ERRO: fetchDisponibilidades não retornou um array:",
      disponibilidades
    );
    return [];
  }

  const eventos = disponibilidades
    .map((d, i) => {
      try {
        const start = `${d.data}T${d.hora}`;
        const end = `${d.data_final}T${d.hora}`; // se o final for no mesmo horário do último dia

        return {
          id: d.id || `disp-${i}`,
          title: `${d.executivo_nome || "Disponível"} - ${d.tipo || "Evento"}`,
          start: start,
          end: end,
          extendedProps: {
            status: d.status || "Livre",
            tipo: d.tipo || "Padrão",
            empreendimento: d.empreendimento || null,
            executivo_nome: d.executivo_nome || null,
            agente_id: d.agente_id || null,
            ticket_id: d.ticket_id || null,
            agente_id: d.agente_id || null,
            background: d.status === "Ocupado" ? "red" : "green",
          },
        };
      } catch (err) {
        console.error("❌ Erro ao mapear disponibilidade:", d, err);
        return null;
      }
    })
    .filter(Boolean);

  console.log("✅ Eventos mapeados para o calendário:", eventos);
  return eventos;
}

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
        // Usa o end do calendário como referência
        const rawEnd = new Date(info.end);

        // Ajusta para o sábado anterior (info.end costuma ser domingo)
        const saturday = new Date(rawEnd);
        saturday.setDate(rawEnd.getDate() - 1); // -1 dia → sábado

        const semanaFinal = saturday.toISOString().slice(0, 10);
        console.log("📌 Data usada no filtro (semana_final):", semanaFinal);

        const disponibilidades = await fetchDisponibilidades(semanaFinal);

        successCallback(disponibilidades);
      } catch (err) {
        console.error("Erro ao carregar disponibilidades:", err);
        failureCallback(err);
      }
    },
    eventClick: function (info) {
      let ticketId = info.event.extendedProps.ticketId;
      console.log("📌 Ticket ID:", ticketId);
      console.log("📌 Evento clicado:", info.event.extendedProps);

      if (ticketId) {
        // Se já existe ticket, abre ele
        let url = `https://vitaconsupport.zendesk.com/agent/tickets/${ticketId}`;
        window.open(url, "_blank");
      } else {
        // 🔹 Pega dados do evento
        const { tipo, empreendimento, status } = info.event.extendedProps;
        const recordId = info.event.id;

        // recordId = ID do objeto personalizado associado ao evento

        // 🔹 Conversão título → tag usando os mapas globais
        // 🔹 Conversão título → value (tag) e label
        const tipoValue = mapTipoByTitle[tipo] || null;
        const empreendimentoValue =
          mapEmpreendimentoByTitle[empreendimento] || null;
        const statusValue = mapStatusByTitle[status] || null;

        const tipoLabel = tipo; // título original do evento
        const empreendimentoLabel = empreendimento;
        const statusLabel = status;

        const dataHora = info.event.start;
        const dataFormatada = dataHora.toLocaleDateString("pt-BR");
        const horaFormatada = dataHora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // 🔹 Renderiza modal
        const modalHtml = `
      <div id="ticketModal" class="fixed inset-0 bg-[#00000096] bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl p-6 w-[400px]">
          <h2 class="text-lg font-bold mb-4">Criar Ticket</h2>
          <p><b>Status:</b> ${statusLabel}</p>
          <p><b>Tipo:</b> ${tipoLabel}</p>
          <p><b>Empreendimento:</b> ${empreendimentoLabel}</p>
          <p><b>Data:</b> ${dataFormatada}</p>
          <p><b>Hora:</b> ${horaFormatada}</p>
          <div class="flex justify-end gap-4 mt-6">
            <button id="cancelTicket" class="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button id="confirmTicket" class="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button>
          </div>
        </div>
      </div>
    `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        // Botão cancelar
        document.getElementById("cancelTicket").onclick = () => {
          document.getElementById("ticketModal").remove();
        };

        // Botão confirmar
        document.getElementById("confirmTicket").onclick = async () => {
          try {
            // 1️⃣ Criação do ticket
            const payload = {
              ticket: {
                brand_id: 34533760739607,
                ticket_form_id: 34533996322071,
                custom_fields: [
                  { id: 34533890144791, value: statusValue},
                  { id: 34533892299671, value: tipoValue},
                  { id: 22242038869783, value: empreendimentoValue},
                  { id: 34496446531991, value: info.event.startStr.split("T")[0]},
                  { id: 35064401218455, value: recordId.toString()},
                  { id: 34496522176663, value: horaFormatada},
                ],
                subject: `Agendamento - ${tipoLabel} - ${empreendimentoLabel}`,
                comment: {
                  body: `Agendamento solicitado:\n- Tipo: ${tipoLabel}\n- Empreendimento: ${empreendimentoLabel}\n- Data: ${dataFormatada}\n- Hora: ${horaFormatada}`,
                },
              },
            };

            console.log("📌 StatusValue:", statusValue);
            console.log("📌 TipoValue:", tipoValue);
            console.log("📌 EmpreendimentoValue:", empreendimentoValue);
            console.log(
              "📌 Payload enviado:",
              JSON.stringify(payload, null, 2)
            );

            const ticketResp = await client.request({
              url: "/api/v2/tickets",
              type: "POST",
              data: payload,
            });

            console.log("📌 Ticket criado:", ticketResp);
            let popUp = document.createElement("div");
            popUp.innerHTML = `<div class="absolute bg-white shadow-xl z-500 top-3 right-3 p-4 rounded-xl flex flex-col gap-4 w-[400px]">
            <p class="text-lg font-bold text-green-600">Ticket criado com sucesso!</p>
            <p>Ir para o ticket: <a href="https://vitaconsupport.zendesk.com/agent/tickets/${ticketResp.ticket.id}" target="_blank" class="text-blue-600">${ticketResp.ticket.id}</a></p>
            </div>`;

            document.body.appendChild(popUp);
            gsap.fromTo(
              popUp,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.2 }
            );
            setTimeout(() => {
              gsap.to(popUp, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
                display: "none",
              });
            }, 5000);

            const newTicketId = ticketResp.ticket.id;
            const currentUser = (await client.get("currentUser")).currentUser;

            // 2️⃣ Atualiza objeto personalizado com status, ticket_id e agente_id
            if (recordId) {
              await client.request({
                url: `/api/v2/custom_objects/availability/records/${recordId}`,
                type: "PUT",
                data: {
                  custom_object_record: {
                    custom_object_fields: {
                      status: "Pendente",
                      ticket_id: newTicketId,
                      agente_id: currentUser.id,
                    },
                  },
                },
              });

              console.log("✅ Objeto personalizado atualizado com sucesso!");
              console.log("📌 Novo recordId:", recordId);
            } else {
              console.warn(
                "⚠️ Nenhum recordId encontrado para atualizar o objeto personalizado."
              );
            }

            document.getElementById("ticketModal").remove();
          } catch (err) {
            console.error("❌ Erro ao criar ticket ou atualizar objeto:", err);
          }
        };
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
        <p><strong>Título:</strong> ${info.event.title}${
        info.event.extendedProps.ticketId
          ? ` - #${info.event.extendedProps.ticketId}`
          : ""
      }</p>
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
