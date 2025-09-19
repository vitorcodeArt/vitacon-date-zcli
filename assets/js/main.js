import { validarECriarDisponibilidades } from "./ticketsCreate.js";

let etapaAtual = 1;
let dados = { tipo: "", empresas: [], datas: [], horas: [] };

const dropdownBtn = document.getElementById("dropdownEmp");
const listaEmpresas = document.getElementById("lista-empresas");
const tagsContainer = document.getElementById("tags-container");
const dropdownEmpText = document.getElementById("dropdownEmpText");
const iconApp = document.querySelectorAll(".bi-app");

function mostrarTela(tela) {
  let menu_etapas = document.getElementById("etapas");
  let menu_tickets = document.getElementById("dates-menu-container");
  // Esconde todas as sections
  document
    .querySelectorAll("section")
    .forEach((sec) => sec.classList.add("hidden"));
  // Mostra a selecionada
  document.getElementById(tela).classList.remove("hidden");

  // Remove destaque de todos os itens do menu
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("bg-[#f29d42]");
  });

  // Adiciona destaque no item clicado
  if (tela === "section-tickets") {
    document.getElementById("menu-tickets").classList.add("bg-[#f29d42]");
    menu_etapas.classList.remove("hidden");
    menu_tickets.classList.add("hidden");
  } else {
    document.getElementById("menu-dates").classList.add("bg-[#f29d42]");
    menu_etapas.classList.add("hidden");
    menu_tickets.classList.remove("hidden");
  }
}

document.getElementById("menu-tickets").onclick = () =>
  mostrarTela("section-tickets");
document.getElementById("menu-dates").onclick = () => {
  mostrarTela("section-dates");
  if (window.mainCalendar) {
    window.mainCalendar.updateSize();
    window.miniCalendar.updateSize();
  } else {
    console.warn("rangeCalendar não está inicializado ainda");
  }
};

// Tela inicial
mostrarTela("section-tickets");

function mostrarEtapa(n) {
  document.querySelectorAll("[data-etapa]").forEach((div) => {
    div.classList.add("opacity-25", "pointer-events-none", "hidden");
    if (parseInt(div.getAttribute("data-etapa")) === n) {
      div.classList.remove("pointer-events-none", "opacity-25", "hidden");
    }
  });

  etapaAtual = n;

  // Progresso visual nos ícones
  document.querySelectorAll('[id^="etapa-icon-"]').forEach((icon) => {
    const etapa = parseInt(icon.id.replace("etapa-icon-", ""));
    if (etapa <= n) {
      // Etapa concluída ou atual → destacar
      icon.classList.add("text-[#f29d42]");
    } else {
      // Etapas posteriores → resetar
      icon.classList.remove("text-[#f29d42]");
    }
  });

  document.querySelectorAll('[id^="etapa-text-"]').forEach((text) => {
    const etapa = parseInt(text.id.replace("etapa-text-", ""));
    if (etapa <= n) {
      // Etapa concluida ou atual → destacar
      text.classList.add("text-[#f29d42]", "text-shadow-lg");
    } else {
      // Etapas posteriores → resetar
      text.classList.remove("text-[#f29d42]", "text-shadow-lg");
    }
  });

  // Linha lateral (ajuste conforme necessidade)
  const widths = { 1: "0px", 2: "33%", 3: "66%", 4: "100%" };
  const lineProgress = document.getElementById("line-progress");
  if (lineProgress) lineProgress.style.width = widths[n];
}

// Seleção empresas (multi)
document.querySelectorAll(".empresa-item").forEach((el) => {
  el.addEventListener("click", () => {
    const nome = el.textContent.trim();
    if (dados.empresas.includes(nome)) {
      dados.empresas = dados.empresas.filter((e) => e !== nome);
      el.classList.remove("bg-violet-200");
    } else {
      dados.empresas.push(nome);
      el.classList.add("bg-violet-200");
    }
  });
});

// Seleção horários (multi)
document.querySelectorAll(".hora-item").forEach((el) => {
  el.addEventListener("click", () => {
    const hora = el.textContent.trim();
    if (dados.horas.includes(hora)) {
      dados.horas = dados.horas.filter((h) => h !== hora);
      el.classList.remove("bg-[#f29d42]", "text-white", "data-selected");
      el.classList.add("bg-gray-200", "text-black");
    } else {
      dados.horas.push(hora);
      el.classList.remove("bg-gray-200", "text-black");
      el.classList.add("bg-[#f29d42]", "text-white", "data-selected");
    }
  });
});

// Botões "Prosseguir"

// etapa 1
document.getElementById("next1").onclick = () => {
  // Verificação
  const tipo = document.getElementById("field-34533892299671").value;
  if (!tipo) {
    swal("Erro!", "Selecione um tipo de agendamento.", "error");
    return;
  }
  dados.tipo = tipo;
  mostrarEtapa(2);
};

// etapa 2
document.getElementById("next2").onclick = () => {
  // Verificação
  // let status_empresas_selecionadas = dropdownEmpText.innerText;
  // if (status_empresas_selecionadas == 'Escolha os empreendimentos') {

  // console.log(status_empresas_selecionadas)
  // document.querySelector('.pato').classList.remove('hidden')
  // alert('Escolha um empreendimento.');
  // return;
  // }

  mostrarEtapa(3);
  if (window.rangeCalendar) {
    window.rangeCalendar.updateSize();
  } else {
    console.warn("rangeCalendar não está inicializado ainda");
  }
};

// etapa 3
document.getElementById("next3").onclick = () => {
  //  Verificação
  const activeDates = selectedDates.filter(
    (d) => !removedDates.some((rd) => rd.getTime() === d.getTime())
  );

  // converter para formato YYYY-MM-DD
  const formattedActive = activeDates.map((d) => d.toISOString().split("T")[0]);

  const formattedRemoved = removedDates.map(
    (d) => d.toISOString().split("T")[0]
  );

  console.log("Datas ativas:", formattedActive);
  console.log("Datas removidas:", formattedRemoved);

  if (formattedActive.length == 0) {
    console.log("Selecione uma data.");
    return;
  }
  // const data = document.querySelector(".data-input").value;
  // if (!data) {
  //   alert('Seleciona uma data.')
  //   return
  // }

  // dados.datas = Array.from(document.querySelectorAll(".data-input"))
  //   .map((i) => i.value)
  //   .filter((v) => v)
  //   .map((v) => {
  //     let [ano, mes, dia] = v.split("-");
  //     return `${dia}/${mes}/${ano}`;
  //   });
  dados.datas = formattedActive;
  mostrarEtapa(4);
};

// etapa 4
document.getElementById("prosseguir4").onclick = () => {
  // Verificação
  let contador = 0;
  const horas = document.querySelectorAll(".hora-item");
  horas.forEach((hora) => {
    if (document.querySelector(".data-selected")) {
      contador++;
    }
  });
  if (contador == 0) {
    swal("Erro!", "Selecione um horário.", "error");
    return;
  }

  // Atualiza resumo antes de mostrar etapa 5
  document.getElementById("resumo-tipo").textContent =
    dados.tipo || "Não informado";
  document.getElementById("resumo-emp").textContent = dados.empresas.length
    ? dados.empresas.join(", ")
    : "Nenhum";
  document.getElementById("resumo-datas").textContent = dados.datas.length
    ? dados.datas.join(", ")
    : "Nenhuma";
  document.getElementById("resumo-horas").textContent = dados.horas.length
    ? dados.horas.join(", ")
    : "Nenhum";

  mostrarEtapa(5);
};

// Botão "Voltar" da etapa 5
document.getElementById("back5").onclick = () => {
  mostrarEtapa(4);
};

document.getElementById("back2").onclick = () => mostrarEtapa(1);
document.getElementById("back3").onclick = () => mostrarEtapa(2);
document.getElementById("back4").onclick = () => mostrarEtapa(3);

function setLoading(isLoading) {
  const overlay = document.getElementById("loadingOverlay");
  if (isLoading) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

document.getElementById("enviar").onclick = () => {
  console.log("Enviando dados:", dados);
  validarECriarDisponibilidades(dados, setLoading);
};

// Inicializar
mostrarEtapa(1);

// Abrir/fechar dropdown
dropdownBtn.addEventListener("click", () => {
  listaEmpresas.classList.toggle("hidden");
});

// Atualizar seleção
listaEmpresas.querySelectorAll("input[type='checkbox']").forEach((cb) => {
  cb.addEventListener("change", () => {
    const nome = cb.value;

    if (cb.checked) {
      // Adiciona ao array
      if (!dados.empresas.includes(nome)) dados.empresas.push(nome);
    } else {
      // Remove do array
      dados.empresas = dados.empresas.filter((e) => e !== nome);
    }

    atualizarTags();
  });
});

async function carregarEmpreendimentos() {
  try {
    const data = await client.request({
      url: `/api/v2/ticket_fields/22242038869783`,
      type: "GET",
    });

    console.log("Campo carregado:", data);

    const opcoes = data.ticket_field.custom_field_options || [];
    const listaEmpresas = document.getElementById("lista-empresas");

    // Limpa antes de popular
    listaEmpresas.innerHTML = "";

    opcoes.forEach((opt) => {
      const label = document.createElement("label");
      label.className =
        "flex items-center px-3 py-1 hover:bg-violet-100 cursor-pointer";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = opt.name; // valor real do campo
      input.className = "mr-2";

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt.name)); // rótulo visível
      listaEmpresas.appendChild(label);

      // Listener de seleção
      input.addEventListener("change", () => {
        const nome = input.value;

        if (input.checked) {
          if (!dados.empresas.includes(nome)) dados.empresas.push(nome);
        } else {
          dados.empresas = dados.empresas.filter((e) => e !== nome);
        }

        atualizarTags();
      });
    });
  } catch (err) {
    console.error("Erro ao carregar campo de empreendimentos:", err);
  }
}

// Função para renderizar tags
function atualizarTags() {
  const tagsContainer = document.getElementById("dropdownEmpText");
  const placeholder = document.getElementById("placeholder-text");

  // Remove apenas as tags antigas, preservando o placeholder
  tagsContainer.querySelectorAll(".tag-empresa").forEach((el) => el.remove());

  if (dados.empresas.length === 0) {
    placeholder.style.display = "inline"; // mostra placeholder se não houver tags
    return;
  }

  placeholder.style.display = "none"; // esconde placeholder

  dados.empresas.forEach((empresa) => {
    const tag = document.createElement("span");
    tag.className =
      "tag-empresa bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center gap-1";

    tag.innerHTML = `
      ${empresa}
      <button class="ml-1 text-violet-700 hover:text-orange-800">×</button>
    `;

    // Clique no X remove
    tag.querySelector("button").addEventListener("click", () => {
      dados.empresas = dados.empresas.filter((e) => e !== empresa);

      // Desmarca o checkbox correspondente
      const cb = document.querySelector(
        `#lista-empresas input[value="${empresa}"]`
      );
      if (cb) cb.checked = false;

      atualizarTags();
    });

    tagsContainer.appendChild(tag);
  });
}

carregarEmpreendimentos();

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !listaEmpresas.contains(e.target)) {
    listaEmpresas.classList.add("hidden");
  }
});
