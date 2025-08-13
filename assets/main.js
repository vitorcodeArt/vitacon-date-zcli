let etapaAtual = 1;
let dados = { tipo: "", empresas: [], datas: [], horas: [] };

const dropdownBtn = document.getElementById("dropdownEmp");
const listaEmpresas = document.getElementById("lista-empresas");
const tagsContainer = document.getElementById("tags-container");
const dropdownEmpText = document.getElementById("dropdownEmpText");
const iconApp = document.querySelectorAll(".bi-app");


function mostrarTela(tela) {
  // Esconde todas as sections
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  // Mostra a selecionada
  document.getElementById(tela).classList.remove("hidden");

  // Remove destaque de todos os itens do menu
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("text-[#cd1a1d]");
  });

  // Adiciona destaque no item clicado
  if (tela === "section-tickets") {
    document.getElementById("menu-tickets").classList.add("text-[#cd1a1d]");
  } else {
    document.getElementById("menu-dates").classList.add("text-[#cd1a1d]");
  }
}

document.getElementById("menu-tickets").onclick = () => mostrarTela("section-tickets");
document.getElementById("menu-dates").onclick = () => mostrarTela("section-dates");

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

  // Progresso visual
  document.querySelectorAll('[id^="etapa-icon-"]').forEach((icon) => icon.classList.remove("text-[#cd1a1d]"));
  const etapaIcon = document.getElementById(`etapa-icon-${n}`);
  if (etapaIcon) etapaIcon.classList.add("text-[#cd1a1d]");
  

  // Linha lateral
  const heights = { 1: "0px", 2: "33%", 3: "66%", 4: "100%" };
  const lineProgress = document.getElementById("line-progress");
  if (lineProgress) lineProgress.style.height = heights[n];

  

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

// Datas dinâmicas
document.getElementById("datas-container").addEventListener("change", (e) => {
  if (e.target.classList.contains("data-input")) {
    const filledInputs = document.querySelectorAll(".data-input").length;
    if (
      e.target.value &&
      e.target === document.querySelectorAll(".data-input")[filledInputs - 1]
    ) {
      const newInput = document.createElement("input");
      newInput.type = "date";
      newInput.className = "data-input border rounded p-2 w-60";
      e.target.parentNode.appendChild(newInput);
    }
  }
});

// Seleção horários (multi)
document.querySelectorAll(".hora-item").forEach((el) => {
  el.addEventListener("click", () => {
    const hora = el.textContent.trim();
    if (dados.horas.includes(hora)) {
      dados.horas = dados.horas.filter((h) => h !== hora);
      el.classList.remove("bg-[#cd1a1d]", "text-white");
      el.classList.add("bg-gray-200", "text-black");
    } else {
      dados.horas.push(hora);
      el.classList.remove("bg-gray-200", "text-black");
      el.classList.add("bg-[#cd1a1d]", "text-white");
    }
  });
});

// Botões navegação
document.getElementById("next1").onclick = () => {
  const tipo = document.getElementById("tipo-agendamento").value;
  if (!tipo) {
    alert("Selecione um tipo de agendamento.");
    return;
  }
  dados.tipo = tipo;
  mostrarEtapa(2);
};

document.getElementById("next2").onclick = () => mostrarEtapa(3);

document.getElementById("next3").onclick = () => {
  dados.datas = Array.from(document.querySelectorAll(".data-input"))
    .map((i) => i.value)
    .filter((v) => v)
    .map((v) => {
      let [ano, mes, dia] = v.split("-");
      return `${dia}/${mes}/${ano}`;
    });
  mostrarEtapa(4);
};

document.getElementById("back2").onclick = () => mostrarEtapa(1);
document.getElementById("back3").onclick = () => mostrarEtapa(2);
document.getElementById("back4").onclick = () => mostrarEtapa(3);

document.getElementById("enviar").onclick = () => {
  console.log("Enviando dados:", dados);
  alert("Enviado com sucesso!");
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

// Função para renderizar tags
function atualizarTags() {
  tagsContainer.innerHTML = "";
  dados.empresas.forEach((emp) => {
    const tag = document.createElement("div");
    tag.className =
      "flex items-center bg-violet-200 text-violet-800 px-2 py-1 rounded";
    tag.innerHTML = `
      <span>${emp}</span>
      <button class="ml-2 text-violet-700 hover:text-violet-900" data-remove="${emp}">&times;</button>
    `;
    tagsContainer.appendChild(tag);
  });

  // Texto do botão
  dropdownEmpText.textContent = dados.empresas.length
    ? `${dados.empresas.length} selecionado(s)`
    : "Escolha os empreendimentos";

  // Eventos de remoção das tags
  tagsContainer.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nome = btn.getAttribute("data-remove");
      dados.empresas = dados.empresas.filter((e) => e !== nome);
      listaEmpresas.querySelector(`input[value="${nome}"]`).checked = false;
      atualizarTags();
    });
  });
}

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !listaEmpresas.contains(e.target)) {
    listaEmpresas.classList.add("hidden");
  }
});

// Botão "Prosseguir" da etapa 4
document.getElementById("prosseguir4").onclick = () => {
  // Atualiza resumo antes de mostrar etapa 5
  document.getElementById("resumo-tipo").textContent = dados.tipo || "Não informado";
  document.getElementById("resumo-emp").textContent = dados.empresas.length ? dados.empresas.join(", ") : "Nenhum";
  document.getElementById("resumo-datas").textContent = dados.datas.length ? dados.datas.join(", ") : "Nenhuma";
  document.getElementById("resumo-horas").textContent = dados.horas.length ? dados.horas.join(", ") : "Nenhum";

  mostrarEtapa(5);
};

// Botão "Voltar" da etapa 5
document.getElementById("back5").onclick = () => {
  mostrarEtapa(4);
};

// Botão "Enviar" final
document.getElementById("enviar").onclick = () => {
  console.log("Enviando dados:", dados);
  alert("Tickets criados com sucesso!");
};