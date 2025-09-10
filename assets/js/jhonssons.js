// campos ids

// agendamento - 39804409012763
// empreendimento - 39880756544539
// horário - 39880638747163
// tipo - 39804354708123

let datas = ["13/08/2025", "14/08/2025", "15/08/2025"]
let empresas = ["empresa 1", "empresa 2", "empresa 3"]
let horas = ["08:00", "09:00", "10:00"]

for (let i = 0; i < datas.length; i++) {
  for (let j = 0; j < empresas.length; j++) {
    for (let k = 0; k < horas.length; k++) {
      let payload = {
        "ticket": {
          "comment": {
            "body": "The smoke is very colorful."
          },
          "custom_fields": [
            {
              "id": 34496446531991,
              "value": "agendamento"
            },
            {
              "id": 24480897626903,
              "value": "empreendimento"
            },
            {
              "id": 34496522176663,
              "value": "horário"
            },
            {
              "id": 34533892299671,
              "value": "tipo"
            }
          ],
          "priority": "urgent",
          "subject": `${datas[i]} - ${empresas[j]} - ${horas[k]}`,
        }
      }
    }
  }
}


let ticket = {
  "ticket": {
    "comment": {
      "body": "The smoke is very colorful."
    },
    "priority": "urgent",
    "subject": `${empresas} - ${datas} - ${horas}`,
  }
}