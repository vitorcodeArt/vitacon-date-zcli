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
        option.value = opt.name;
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


export async function getDisponibilidades(mesReferencia, novosPayloads = []) {
  try {
    // 🔹 Extrai ano-mês (YYYY-MM) do primeiro item que o usuário está tentando criar
    const [ano, mes] = mesReferencia.split("-");
    const inicioMes = `${ano}-${mes}-01`;
    const fimMes = `${ano}-${mes.padStart(2, "0")}-31`; // safe para mês fixo

    let url = `/api/v2/custom_objects/availability/records?page[size]=100` +
              `&filter[fields.data][gte]=${inicioMes}` +
              `&filter[fields.data][lte]=${fimMes}`;

    let allRecords = [];

    while (url) {
      const data = await client.request({ url, type: "GET" });

      // 🔹 Loga a resposta bruta da API
      console.log("📥 Resposta bruta da API:", data);

      if (data?.custom_object_records?.length) {
        const mapped = data.custom_object_records.map((rec) => {
          const f = rec.custom_object_fields;
          if (!f.tipo || !f.empreendimento || !f.data || !f.hora) return null;

          const padData = f.data.split("T")[0]; // YYYY-MM-DD
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

        allRecords.push(...mapped);
      }

      // 🔹 Pega próxima página (se houver)
      url = data.links?.next || null;
    }

    console.log(`📦 Total de disponibilidades carregadas para ${mesReferencia}: ${allRecords.length}`);
    console.log("📋 Disponibilidades existentes:", allRecords);

    // 🔹 Se recebemos novos payloads, comparar com os existentes
    if (novosPayloads.length > 0) {
      const duplicados = [];
      const novosValidos = [];

      for (let novo of novosPayloads) {
        const existe = allRecords.some(
          (d) =>
            d.tipo === novo.tipo &&
            d.empreendimento === novo.empreendimento &&
            d.data === novo.data &&
            d.hora === novo.hora
        );

        if (existe) {
          duplicados.push(novo);
        } else {
          novosValidos.push(novo);
        }
      }

      console.log("⚠️ Duplicados detectados:", duplicados);
      console.log("✅ Novos que serão criados:", novosValidos);

      return { existentes: allRecords, duplicados, novosValidos };
    }

    return allRecords;

  } catch (err) {
    console.error("Erro ao buscar disponibilidades:", err);
    throw err;
  }
}



export async function fetchDisponibilidades(semanaFinal) {
  try {
    let allRecords = [];
    let url = `/api/v2/custom_objects/availability/records/search`;
    let body = {
      filter: {
        "custom_object_fields.semana_final": { "$eq": semanaFinal }
      }
    };

    while (url) {
      const data = await client.request({
        url,
        type: "POST",
        data: body
      });

      if (!data.custom_object_records?.length) {
        console.warn("⚠️ Nenhum registro encontrado nesta página.");
        break;
      }

      const disponibilidades = data.custom_object_records.map(record => {
        const f = record.custom_object_fields;

        // garante apenas AAAA-MM-DD
        const datePart = f.data?.split("T")[0];
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
            agenteId: f.agente_id,
            ticketId: f.ticket_id
          },
        };
      });

      allRecords.push(...disponibilidades);

      // paginação via cursor (se a API retornar)
      url = data.links?.next || null;
      // na próxima iteração, não mandamos body de novo no "next"
      if (url) body = null;
    }

    return allRecords;
  } catch (err) {
    console.error("Erro ao buscar disponibilidades:", err);
    throw err;
  }
}

export async function createDisponibilidades(payloads) {
  try {
    // Mapeia todos os payloads garantindo semana_final
    const items = payloads.map((payload) => {
      const semanaFinal = payload.semana_final || calcularDataFinal(payload.data);
      return {
        custom_object_fields: {
          data: payload.data,
          data_final: payload.data_final,
          semana_final: semanaFinal,
          hora: payload.hora,
          tipo: payload.tipo,
          empreendimento: payload.empreendimento,
          status: payload.status || "Livre",
          agente_id: payload.agente_id || null,
          executivo_nome: payload.executivo_nome || null
        }
      };
    });

    // Divide em chunks de 100 itens
    const chunkSize = 100;
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    const allJobs = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🚀 Criando job ${i + 1}/${chunks.length} com ${chunk.length} registros`);

      const response = await client.request({
        url: `/api/v2/custom_objects/availability/jobs`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          job: {
            action: "create",
            items: chunk
          }
        })
      });

      // Garantir que job_status existe
      const jobStatus = response.job_status;
      if (!jobStatus?.id) {
        throw new Error("Não foi possível criar o job: job_status.id não encontrado");
      }

      console.log(`📌 Job ${i + 1} disparado:`, jobStatus);
      allJobs.push(jobStatus);
    }

    return allJobs; // retorna todos os jobs (cada um com id) para polling
  } catch (err) {
    console.error("Erro ao criar disponibilidades em lote:", err);
    throw err;
  }
}


 function getGroupColor(status) {
    if (status === "Agendado") return "#FF6B6B";
    if (status === "Pendente") return "#ffba6bff";
    if (status === "Livre") return "#4ECDC4";
  }
