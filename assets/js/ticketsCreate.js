// ticketsCreate.js
import { createTicket, getTickets, getFields } from "./ticketsService.js";

getFields();

let existingTicketsCache = null;

export async function validarECriarTickets(dados) {
  try {
    if (!existingTicketsCache) {
      const tickets = await getTickets();
      existingTicketsCache = tickets.map(t => ({
        tipo: t.tipo,
        empreendimento: t.empreendimento,
        data: t.data,
        hora: t.hora
      }));
    }

    const ticketsCriados = [];
    const ticketsDuplicados = [];

    for (let empresa of dados.empresas) {
      for (let data of dados.datas) {
        for (let hora of dados.horas) {

          const duplicado = existingTicketsCache.some(t => 
            t.tipo === dados.tipo &&
            t.empreendimento === empresa &&
            t.data === data &&
            t.hora === hora
          );

          if (duplicado) {
            ticketsDuplicados.push({ tipo: dados.tipo, empresa, data, hora });
            continue;
          }

          const ticketPayload = {
            ticket: {
              subject: "Calendar by Tickets",
              brand_id: 24140649175707,
              ticket_form_id: 39804179516187,
              comment: {
                body: `Agendamento:
- Tipo: ${dados.tipo}
- Empreendimento: ${empresa}
- Data: ${data}
- Hora: ${hora}`
              },
              priority: "normal",
              custom_fields: [
                { id: 39804354708123, value: dados.tipo },
                { id: 39880756544539, value: empresa },
                { id: 39880638747163, value: hora },
                { id: 39804409012763, value: data },
                { id: 39880698235803, value: "vita_agenda_status_livre" }
              ]
            }
          };

          const retorno = await createTicket(ticketPayload);
          ticketsCriados.push(retorno);

          // Atualiza cache
          existingTicketsCache.push({
            tipo: dados.tipo,
            empreendimento: empresa,
            data: data,
            hora: hora
          });
        }
      }
    }

    // Monta popup com resultado
    let mensagem = `<strong>Tickets Criados:</strong><br>`;
    ticketsCriados.forEach(t => {
      mensagem += `✅ ${t.tipo}, ${t.empreendimento}, ${t.data}, ${t.hora}<br>`;
    });
    if (ticketsDuplicados.length) {
      mensagem += `<br><strong>Tickets Duplicados:</strong><br>`;
      ticketsDuplicados.forEach(t => {
        mensagem += `❌ ${t.tipo}, ${t.empreendimento}, ${t.data}, ${t.hora}<br>`;
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

    return ticketsCriados;

  } catch (err) {
    console.error("Erro ao validar/criar tickets:", err);
    return [];
  }
}
