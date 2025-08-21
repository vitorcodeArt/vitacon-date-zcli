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


// client.request({
//   url: `/api/v2/ticket_fields/${field_id_tipo}.json`,
//   type: 'GET',
// })
//   .then(function(data) {
    
//     api_return_tipo = data.ticket_field.custom_field_options;
//     console.log(api_return_tipo);

//     api_return_tipo.forEach((item) => {
//       api_values_tipo[0].names.push(item.name);
//       api_values_tipo[1].values.push(item.value);
//     });

//     console.log(api_values_tipo);
    
// })
//   .catch(function(err) {
//     console.error("Erro na requisição:", err);
//   });


// let eventsByTicket = [];

// // IDs dos campos personalizados que você quer
// const FIELDS_MAP = {
//   "39804354708123": "tipo",
//   "39880756544539": "empreendimento",
//   "39880638747163": "horário",
//   "39804409012763": "agendamento"
// };

// client.request({
//   url: `/api/v2/search.json?query=type:ticket ticket_form_id:39804179516187`,
//   type: 'GET',
// })
// .then(function(data) {
//   eventsByTicket = data.results.map(ticket => {
//     let custom = {};
//     for (let fieldId in FIELDS_MAP) {
//       custom[FIELDS_MAP[fieldId]] = ticket.fields?.find(f => f.id == fieldId)?.value || null;
//     }
//     return {
//       id: ticket.id,
//       ...custom
//     };
//   });

//   console.log("Tickets formatados:", eventsByTicket);

//   // Limpa eventos existentes (se quiser atualizar a cada requisição)
//   calendar.removeAllEvents();

//   // Adiciona ao calendário
//   eventsByTicket.forEach(event => {
//     // monta data/hora
//     let startDate = event.agendamento;
//     if (event.horário) {
//       startDate = `${startDate}T${event.horário}`;
//     }

//     calendar.addEvent({
//       id: event.id,
//       title: `${event.tipo} - ${event.empreendimento}`,
//       start: startDate,
//       backgroundColor: getGroupColor(event.empreendimento),
//       classNames: [event.empreendimento]
//     });
//   });

//   calendar.render();
// })
// .catch(function(err) {
//   console.error("Erro na requisição:", err);
// });
