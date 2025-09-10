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

    let wantedIds = [34533892299671, 34533890144791]; // tipo e status
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
  34533892299671: "tipo",
  24480897626903: "empreendimento",
  34496522176663: "horario",
  34496446531991: "agendamento",
  34533890144791: "status",
};

export async function getEmpreendimentos() {
  try {
    const data = await client.request({
      url: `/api/v2/ticket_fields/22242038869783`,
      type: "GET",
    });

    console.log("Campo de empreendimentos:", data.ticket_field);

    return data.ticket_field.custom_field_options; 
    // cada item = {id, name, value, default}
  } catch (error) {
    console.error("Erro ao carregar empreendimentos:", error);
    return [];
  }
}


// 🔹 Função para buscar tickets e padronizar os campos
// export async function getTickets() {
//   try {
//     const data = await client.request({
//       url: `/api/v2/search.json?query=type:ticket ticket_form_id:39804179516187`,
//       type: "GET",
//     });

//     // Retorna apenas os campos importantes de cada ticket
//     return data.results.map((ticket) => {
//       let custom = {};
//       for (let fieldId in FIELDS_MAP) {
//         const field = ticket.fields?.find((f) => f.id == fieldId);
//         custom[FIELDS_MAP[fieldId]] = field ? field.value : null;
//       }

//       if (!custom.tipo || !custom.empreendimento || !custom.agendamento || !custom.horario) {
//         return null; // descarta tickets incompletos
//       }

//       // padroniza a data/hora como string "YYYY-MM-DD" e "HH:mm"
//       const padData = custom.agendamento; // assume que já vem nesse formato
//       const padHora = custom.horario.padStart(5, "0"); // "09:00" em vez de "9:00"

//       return {
//         ticketId: ticket.id,
//         tipo: custom.tipo,
//         empreendimento: custom.empreendimento,
//         data: padData,
//         hora: padHora,
//       };
//     }).filter(Boolean);
//   } catch (err) {
//     console.error("Erro ao buscar tickets:", err);
//     throw err;
//   }
// }

// 🔹 Função para criar ticket usando ZAF client
// export async function createTicket(payload) {
//   try {
//     const response = await client.request({
//       url: `/api/v2/tickets.json`,
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(payload),
//     });

//     // Retorna o ticket criado com os campos importantes
//     const t = response.ticket;
//     const custom = {};
//     for (let fieldId in FIELDS_MAP) {
//       const f = t.fields?.find((f) => f.id == fieldId);
//       custom[FIELDS_MAP[fieldId]] = f ? f.value : null;
//     }

//     return {
//       ticketId: t.id,
//       tipo: custom.tipo,
//       empreendimento: custom.empreendimento,
//       data: custom.agendamento,
//       hora: custom.horario,
//     };
//   } catch (err) {
//     console.error("Erro ao criar ticket:", err);
//     throw err;
//   }
// }

export async function getDisponibilidades() {
  try {
    const data = await client.request({
      url: `/api/v2/custom_objects/availability/records`,
      type: "GET",
    });

    // transforma registros em objetos simplificados
    return data.custom_object_records.map((rec) => {
      const f = rec.custom_object_fields;

      if (!f.tipo || !f.empreendimento || !f.data || !f.hora) {
        return null; // descarta registros incompletos
      }

      const padData = f.data.split("T")[0]; // pega só YYYY-MM-DD
      const padHora = f.hora.padStart(5, "0");

      return {
        id: rec.id,
        tipo: f.tipo,
        empreendimento: f.empreendimento,
        data: padData,
        hora: padHora,
        status: f.status,
      };
    }).filter(Boolean);

  } catch (err) {
    console.error("Erro ao buscar disponibilidades:", err);
    throw err;
  }
}

export async function fetchDisponibilidades(semanaFinal) {
  try {
    let allRecords = [];
    let url = `/api/v2/custom_objects/availability/records/search?query=semana_final:${semanaFinal}`;

    while (url) {
      const data = await client.request({ url, type: "GET" });

      if (!data.custom_object_records.length) {
        console.warn("⚠️ Nenhum registro encontrado nesta página.");
        break;
      }

      const disponibilidades = data.custom_object_records.map(record => {
        const f = record.custom_object_fields;

        // extrai apenas YYYY-MM-DD
        const datePart = f.data.split("T")[0];
        const startDate = f.hora ? `${datePart}T${f.hora}` : datePart;

        return {
          id: record.id,
          title: `${f.tipo} - ${f.empreendimento}`,
          start: startDate,
          borderColor: getGroupColor(f.status),
          backgroundColor: getGroupColor(f.status),
          color: "#fff",
          classNames: [f.tipo, f.empreendimento],
          extendedProps: {
            status: f.status,
            empreendimento: f.empreendimento,
            tipo: f.tipo,
            executivo: f.executivo_nome,
            agenteId: f.agente_id
          },
        };
      });

      allRecords.push(...disponibilidades);

      // paginação por cursor
      url = data.links?.next || null;
    }

    console.log("✅ Eventos mapeados para o calendário:", allRecords);
    return allRecords;
  } catch (err) {
    console.error("Erro ao buscar disponibilidades:", err);
    throw err;
  }
}




export async function createDisponibilidade(payload) {
  try {
    // calcula semana_final se não estiver no payload
    let semanaFinal = payload.semana_final;
    if (!semanaFinal) {
      semanaFinal = calcularDataFinal(payload.data); // função retorna "YYYY-MM-DD"
    }

    const response = await client.request({
      url: `/api/v2/custom_objects/availability/records`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        custom_object_record: {
          custom_object_fields: {
            data: payload.data,                 // "2025-09-01T00:00:00+00:00"
            data_final: payload.data_final,     // "2025-09-06T00:00:00+00:00"
            semana_final: semanaFinal,          // Novo campo
            hora: payload.hora,                 // "12:00"
            tipo: payload.tipo,                 // "Vistoria"
            empreendimento: payload.empreendimento,
            status: payload.status || "Livre",
            agente_id: payload.agente_id || null,
            executivo_nome: payload.executivo_nome || null
          }
        }
      })
    });

    return response.custom_object_record;
  } catch (err) {
    console.error("Erro ao criar disponibilidade:", err);
    throw err;
  }
}


// 🔹 Função genérica para buscar tickets
// export async function fetchTickets(startOfWeek, endOfWeek) {
//   try {
//     let allTickets = [];
//     let url = `/api/v2/search.json?query=type:ticket ticket_form_id:34533996322071`;

//     while (url) {
//       const data = await client.request({ url, type: "GET" });

//       const tickets = data.results.map(ticket => {
//         // transforma fields em mapa para performance
//         const fieldsMap = {};
//         (ticket.fields || []).forEach(f => fieldsMap[f.id] = f.value);

//         let custom = {};
//         for (let fieldId in FIELDS_MAP) {
//           custom[FIELDS_MAP[fieldId]] = fieldsMap[fieldId] || null;
//         }

//         if (!custom.agendamento) return null;

//         // filtra pela semana
//         if (custom.agendamento < startOfWeek || custom.agendamento > endOfWeek) return null;

//         let startDate = custom.agendamento;
//         if (custom.horario) startDate = `${startDate}T${custom.horario}`;

//         return {
//           id: ticket.id,
//           title: `${VALUE_LABEL_MAP[custom.tipo] || custom.tipo} - ${VALUE_LABEL_MAP[custom.empreendimento] || custom.empreendimento}`,
//           start: startDate,
//           borderColor: getGroupColor(custom.status),
//           backgroundColor: getGroupColor(custom.status),
//           color: "#fff",
//           classNames: [custom.tipo, custom.empreendimento],
//           extendedProps: {
//             ticketId: ticket.id,
//             status: custom.status,
//             empreendimento: custom.empreendimento,
//             tipo: custom.tipo,
//           },
//         };
//       }).filter(Boolean);

//       allTickets.push(...tickets);
//       url = data.next_page; // próxima página
//     }

//     return allTickets;
//   } catch (error) {
//     console.error("Erro ao buscar tickets:", error);
//     throw error;
//   }
// }


 function getGroupColor(status) {
    if (status === "vita_agenda_status_agendado") return "#FF6B6B";
    if (status === "vita_agenda_status_livre") return "#4ECDC4";
  }
