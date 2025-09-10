import { createDisponibilidade, getDisponibilidades } from "./ticketsService.js";

let existingDisponCache = null;

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

export async function validarECriarDisponibilidades(dados) {
  try {
    if (!existingDisponCache) {
      const disponibilidades = await getDisponibilidades();
      existingDisponCache = disponibilidades.map(d => ({
        tipo: d.tipo,
        empreendimento: d.empreendimento,
        data: d.data,
        hora: d.hora
      }));
    }

    const disponCriadas = [];
    const disponDuplicadas = [];

    for (let empresa of dados.empresas) {
      for (let data of dados.datas) {
        for (let hora of dados.horas) {
          
          const duplicado = existingDisponCache.some(d =>
            d.tipo === dados.tipo &&
            d.empreendimento === empresa &&
            d.data === data &&
            d.hora === hora
          );

          if (duplicado) {
            disponDuplicadas.push({ tipo: dados.tipo, empresa, data, hora });
            continue;
          }

          const dataFinalStr = calcularDataFinal(data); // ex: "2025-09-13"

          const payload = {
            data: data, // se o backend espera "YYYY-MM-DD" ou "YYYY-MM-DDT00:00:00+00:00" adapte
            data_final: dataFinalStr, // ou dataFinalStr + "T00:00:00+00:00"
            semana_final: dataFinalStr, // adicionado aqui

            hora: hora,
            tipo: dados.tipo,
            empreendimento: empresa,
            status: "Livre",
            agente_id: dados.agente_id || null,
            executivo_nome: dados.executivo_nome || null
          };

          const retorno = await createDisponibilidade(payload);
          disponCriadas.push(retorno);

          // Atualiza cache
          existingDisponCache.push({
            tipo: dados.tipo,
            empreendimento: empresa,
            data: data,
            hora: hora
          });
        }
      }
    }

    // Monta popup com resultado
    let mensagem = `<strong>Disponibilidades Criadas:</strong><br>`;
    disponCriadas.forEach(d => {
      const f = d.custom_object_fields;
      mensagem += `✅ ${f.tipo}, ${f.empreendimento}, ${f.data}, ${f.hora}<br>`;
    });
    if (disponDuplicadas.length) {
      mensagem += `<br><strong>Duplicadas:</strong><br>`;
      disponDuplicadas.forEach(d => {
        mensagem += `❌ ${d.tipo}, ${d.empresa}, ${d.data}, ${d.hora}<br>`;
      });
    }

    // Cria modal simples
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div style="
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #000;
        max-height: 80%; overflow-y: auto; z-index: 9999;
      ">
        ${mensagem}
        <button id="fecharModal" style="margin-top: 10px; padding: 5px 10px;">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("fecharModal").onclick = () => modal.remove();

    return disponCriadas;

  } catch (err) {
    console.error("Erro ao validar/criar disponibilidades:", err);
    return [];
  }
}
