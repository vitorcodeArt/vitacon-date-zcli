import {
  createDisponibilidades,
  getDisponibilidades,
} from "./ticketsService.js";

let existingDisponCache = null;

let createdDisponIds = []; // array global para armazenar os IDs

function calcularDataFinal(dataInput) {
  // extrai ano-mes-dia de forma segura (ignora horas e offsets)
  let y, m, d;
  if (dataInput instanceof Date) {
    y = dataInput.getFullYear();
    m = dataInput.getMonth() + 1;
    d = dataInput.getDate();
  } else if (typeof dataInput === "string") {
    // pega os primeiros 10 chars se for formato ISO (yyyy-mm-dd)
    const match = dataInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      y = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      d = parseInt(match[3], 10);
    } else {
      // fallback: cria Date e extrai (menos preferível)
      const tmp = new Date(dataInput);
      y = tmp.getFullYear();
      m = tmp.getMonth() + 1;
      d = tmp.getDate();
    }
  } else {
    throw new Error("Formato de data inválido");
  }

  // cria uma Date no UTC para evitar shifts locais
  const dt = new Date(Date.UTC(y, m - 1, d)); // meia-noite UTC da data
  const diaSemana = dt.getUTCDay(); // 0=domingo, 6=sábado

  // diferença até o sábado da mesma semana
  let diff;
  if (diaSemana === 0) {
    // domingo -> sábado da MESMA semana (6 dias à frente)
    diff = 6;
  } else {
    // segunda (1) ... sábado (6)
    diff = 6 - diaSemana;
  }

  const dtFinal = new Date(dt);
  dtFinal.setUTCDate(dt.getUTCDate() + diff);

  // format YYYY-MM-DD
  const yyyy = dtFinal.getUTCFullYear();
  const mm = String(dtFinal.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dtFinal.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

async function waitForJobCompletion(jobId, interval = 2000, timeout = 60000) {
  const start = Date.now();

  while (true) {
    const jobResponse = await client.request({
      url: `/api/v2/job_statuses/${jobId}.json`, // <- rota correta
      type: "GET",
    });

    const job = jobResponse.job_status;
    console.log(`⏳ Job ${jobId} - status: ${job.status}`);

    if (job.status === "completed") {
      console.log("✅ Job finalizado com sucesso:", job);
      return job;
    }

    if (job.status === "failed") {
      console.error("❌ Job falhou:", job);
      throw new Error("Falha na criação em massa.");
    }

    if (Date.now() - start > timeout) {
      throw new Error("⏰ Timeout: Job demorou demais para completar.");
    }

    await new Promise((res) => setTimeout(res, interval));
  }
}


export async function validarECriarDisponibilidades(dados, setLoading) {
  try {
    if (setLoading) setLoading(true);

    // ================================
    // Inicializa cache com registros existentes
    // ================================
    if (!existingDisponCache) {
      const primeiraData = dados.datas[0]; // formato "YYYY-MM-DD"
      const mesReferencia = primeiraData.slice(0, 7); // "YYYY-MM"

      const disponibilidades = await getDisponibilidades(mesReferencia);

      console.log("🔹 Disponibilidades já existentes retornadas pela API:", disponibilidades);

      existingDisponCache = disponibilidades.map((d) => ({
        tipo: d.tipo,
        empreendimento: d.empreendimento,
        data: d.data,
        hora: d.hora,
      }));

      console.log("📦 Cache inicializado:", existingDisponCache);
    }

    // ================================
    // Monta payloads novos e detecta duplicados
    // ================================
    const disponDuplicadas = [];
    const novosPayloads = [];

    for (let empresa of dados.empresas) {
      for (let data of dados.datas) {
        for (let hora of dados.horas) {
          const candidato = {
            tipo: dados.tipo,
            empreendimento: empresa,
            data,
            hora: hora.padStart(5, "0"),
          };

          const jaExiste = existingDisponCache.some(
            (d) =>
              d.tipo === candidato.tipo &&
              d.empreendimento === candidato.empreendimento &&
              d.data === candidato.data &&
              d.hora === candidato.hora
          );

          if (jaExiste) {
            disponDuplicadas.push(candidato);
            continue;
          }

          const dataFinalStr = calcularDataFinal(data);

          novosPayloads.push({
            data: candidato.data,
            data_final: dataFinalStr,
            semana_final: dataFinalStr,
            hora: candidato.hora,
            tipo: candidato.tipo,
            empreendimento: candidato.empreendimento,
            status: "Livre",
            agente_id: dados.agente_id || null,
            executivo_nome: dados.executivo_nome || null,
          });

          // adiciona ao cache para evitar recriar no mesmo fluxo
          existingDisponCache.push(candidato);
        }
      }
    }

    console.log("⚠️ Disponibilidades duplicadas ignoradas:", disponDuplicadas);
    console.log("✅ Novos payloads a serem criados:", novosPayloads);

    if (novosPayloads.length === 0) {
      console.log("⚠️ Nenhuma disponibilidade nova a ser criada.");
      return { criadas: [], duplicadas: disponDuplicadas };
    }

    // ================================
    // Cria jobs em chunks de até 100 registros
    // ================================
    const allJobs = await createDisponibilidades(novosPayloads);

    const allIds = [];

    // ================================
    // Polling automático para acompanhar cada job
    // ================================
    for (let i = 0; i < allJobs.length; i++) {
      const job = allJobs[i];
      const jobId = job?.id;

      if (!jobId) {
        console.error("❌ Job ID não encontrado na resposta da API:", job);
        continue;
      }

      if (setLoading) setLoading(`Criando job ${i + 1}/${allJobs.length}...`);
      console.log(`⏳ Aguardando finalização do job ${i + 1}/${allJobs.length} (ID: ${jobId})`);

      const finalJob = await waitForJobCompletion(jobId);

      const idsCriadas = finalJob.results?.map((item) => item.id) || [];
      console.log(`✅ Job ${i + 1} finalizado. IDs criadas:`, idsCriadas);

      allIds.push(...idsCriadas);
    }

    return { criadas: allIds, duplicadas: disponDuplicadas };
  } catch (err) {
    console.error("❌ Erro ao validar/criar disponibilidades:", err);
    return { criadas: [], duplicadas: [] };
  } finally {
    if (setLoading) setLoading(false);
  }
}

