// let field_id_tipo = 39804354708123;
// let field_id_agendamento = 39804409012763;
// let field_id_empreendimento = 39880756544539;
// let field_id_horario = 39880638747163;


// let api_return_tipo = [];
// let api_values_tipo = [
//     {
//         "names": []
//     },
//     {
//         "values": []
//     }

// ];

// ticketsService.js
// let client = null;

// export function initTicketsService(zafClient) {
//   client = zafClient;
// }
export let VALUE_LABEL_MAP = {}; // global para rótulos

export async function getFields() {
  try {
    const data = await client.request({
      url: `/api/v2/ticket_fields`,
      type: "GET",
    });

    console.log("Campos carregados:", data.ticket_fields);

    let wantedIds = [39804354708123, 39880698235803]; // tipo e status
    let filtered = data.ticket_fields.filter(f => wantedIds.includes(f.id));

    // Preencher selects
    filtered.forEach(field => {
      // usa o ID do campo como ID do <select>
      const select = document.getElementById(`field-${field.id}`);
      if (!select) return;

      // limpa opções antigas (mantém o "Escolha uma opção")
      select.querySelectorAll("option:not([value=''])").forEach(opt => opt.remove());

      // adiciona dinamicamente
      field.custom_field_options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.name;
        select.appendChild(option);
      });
    });

    // monta o mapa de opções -> rótulos
    VALUE_LABEL_MAP = {};
    filtered.forEach(field => {
      field.custom_field_options?.forEach(opt => {
        VALUE_LABEL_MAP[opt.value] = opt.name; 
        // exemplo: "vita_agenda_tipo_vistoria" -> "Vistoria"
      });
    });

    console.log("Mapa de rótulos:", VALUE_LABEL_MAP);

    return filtered;
  } catch (err) {
    console.error("Erro ao buscar campos:", err);
    throw err;
  }
}



// Buscar tickets existentes
// ticketsService.js
const FIELDS_MAP = {
  39804354708123: "tipo",
  39880756544539: "empreendimento",
  39880638747163: "horario",
  39804409012763: "agendamento",
  39880698235803: "status",
};

// 🔹 Função para buscar tickets e padronizar os campos
export async function getTickets() {
  try {
    const data = await client.request({
      url: `/api/v2/search.json?query=type:ticket ticket_form_id:39804179516187`,
      type: "GET",
    });

    // Retorna apenas os campos importantes de cada ticket
    return data.results.map((ticket) => {
      let custom = {};
      for (let fieldId in FIELDS_MAP) {
        const field = ticket.fields?.find((f) => f.id == fieldId);
        custom[FIELDS_MAP[fieldId]] = field ? field.value : null;
      }

      if (!custom.tipo || !custom.empreendimento || !custom.agendamento || !custom.horario) {
        return null; // descarta tickets incompletos
      }

      // padroniza a data/hora como string "YYYY-MM-DD" e "HH:mm"
      const padData = custom.agendamento; // assume que já vem nesse formato
      const padHora = custom.horario.padStart(5, "0"); // "09:00" em vez de "9:00"

      return {
        ticketId: ticket.id,
        tipo: custom.tipo,
        empreendimento: custom.empreendimento,
        data: padData,
        hora: padHora,
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("Erro ao buscar tickets:", err);
    throw err;
  }
}

// 🔹 Função para criar ticket usando ZAF client
export async function createTicket(payload) {
  try {
    const response = await client.request({
      url: `/api/v2/tickets.json`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
    });

    // Retorna o ticket criado com os campos importantes
    const t = response.ticket;
    const custom = {};
    for (let fieldId in FIELDS_MAP) {
      const f = t.fields?.find((f) => f.id == fieldId);
      custom[FIELDS_MAP[fieldId]] = f ? f.value : null;
    }

    return {
      ticketId: t.id,
      tipo: custom.tipo,
      empreendimento: custom.empreendimento,
      data: custom.agendamento,
      hora: custom.horario,
    };
  } catch (err) {
    console.error("Erro ao criar ticket:", err);
    throw err;
  }
}

// 🔹 Função genérica para buscar tickets
export async function fetchTickets(startOfWeek, endOfWeek) {
  try {
    let allTickets = [];
    let url = `/api/v2/search.json?query=type:ticket ticket_form_id:39804179516187`;

    while (url) {
      const data = await client.request({ url, type: "GET" });

      const tickets = data.results.map(ticket => {
        // transforma fields em mapa para performance
        const fieldsMap = {};
        (ticket.fields || []).forEach(f => fieldsMap[f.id] = f.value);

        let custom = {};
        for (let fieldId in FIELDS_MAP) {
          custom[FIELDS_MAP[fieldId]] = fieldsMap[fieldId] || null;
        }

        if (!custom.agendamento) return null;

        // filtra pela semana
        if (custom.agendamento < startOfWeek || custom.agendamento > endOfWeek) return null;

        let startDate = custom.agendamento;
        if (custom.horario) startDate = `${startDate}T${custom.horario}`;

        return {
          id: ticket.id,
          title: `${VALUE_LABEL_MAP[custom.tipo] || custom.tipo} - ${VALUE_LABEL_MAP[custom.empreendimento] || custom.empreendimento}`,
          start: startDate,
          borderColor: getGroupColor(custom.status),
          backgroundColor: getGroupColor(custom.status),
          color: "#fff",
          classNames: [custom.tipo, custom.empreendimento],
          extendedProps: {
            ticketId: ticket.id,
            status: custom.status,
            empreendimento: custom.empreendimento,
            tipo: custom.tipo,
          },
        };
      }).filter(Boolean);

      allTickets.push(...tickets);
      url = data.next_page; // próxima página
    }

    return allTickets;
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    throw error;
  }
}


 function getGroupColor(status) {
    if (status === "vita_agenda_status_agendado") return "#FF6B6B";
    if (status === "vita_agenda_status_livre") return "#4ECDC4";
  }
