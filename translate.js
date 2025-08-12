// ************ CODE VITOR SUMARY ************
// 1- CONFIGURACOES INICIAIS 📌

// 2- VARIAVEIS GLOBAIS 🌍

// 3- ARM. DE DADOS 🎲

// 4- FUNÇÕES AUXILIARES 💢

// 5- REQUISIÇÕES API 📬

// 6- RENDERIZAR NA TELA 🕒

// 7- ANIMAÇÕES 👀

// 8- EVENT LISTENER 🕷

// *---------------------------------*
// *--- 📌 CONFIGURACOES INICIAIS ---*
// *---------------------------------*
const email = "fabio.santos@bcrcx.com";
const token = "XLkEPqxQOC9N8MSYBlkjUohGrGNqGtwxymx6er3t";
const credentials = btoa(`${email}/token:${token}`);

// *---------------------------------*
// *----- 🌍 VARIAVEIS GLOBAIS -----*
// *---------------------------------*
const searchInput = document.getElementById("searchInput");
const communityMembers = document.getElementById("community-members");

let submenuAberto = null; // null, 'solicitacoes' ou 'eventos'
let sidebarOpen = true; // Controle da sidebar principal
let sidebarEstavaAbertaAoAbrirSubmenu = true; // Novo controle de estado anterior da sidebar

const selectedImages = [];
const previewContainer = document.getElementById("preview_container");
let eventosCarregados = false;
let ulEventos = null;


// *---------------------------------*
// *-------- 🎲 TRADUÇÕES -------*
// *---------------------------------*

const lang = document.documentElement.lang || 'pt-br';

const translations = {
  "pt-br": {
    greeting: "Olá",
    welcome: "Seja bem-vindo(a) à BCR-EX!",
    subtitle: "Selecione ao lado a área que deseja se informar.",
    seeMore: "Veja mais",
    usefulLinks: "Links úteis",
    links: {
      holerite: "Holerite",
      kairos: "Kairos",
      falaBee: "Fala Bee",
      statusBCR: "Status BCR",
      statusZendesk: "Status Zendesk"
    },
    home: "Home",
    solicitacoes: "Solicitações",
    comunidade: "Comunidade",
    eventos: "Eventos",
    minhaArea: "Minha Área",
    meuPerfil: "Meu perfil",
    pesquisar: "Pesquisar",
    tituloModal: "Título",
  },
  "en-us": {
    greeting: "Hello",
    welcome: "Welcome to BCR-EX!",
    subtitle: "Select the area you want to explore on the side.",
    seeMore: "See more",
    usefulLinks: "Useful Links",
    links: {
      holerite: "Pay Slip",
      kairos: "Kairos",
      falaBee: "Fala Bee",
      statusBCR: "BCR Status",
      statusZendesk: "Zendesk Status"
    },
    home: "Home",
    solicitacoes: "Requests",
    comunidade: "Community",
    eventos: "Events",
    minhaArea: "My Area",
    meuPerfil: "My Profile",
    pesquisar: "Search",
    tituloModal: "Title",
  },
  "es": {
    greeting: "Hola",
    welcome: "¡Bienvenido(a) a BCR-EX!",
    subtitle: "Seleccione al lado el área que desea consultar.",
    seeMore: "Ver más",
    usefulLinks: "Enlaces útiles",
    links: {
      holerite: "Recibo de sueldo",
      kairos: "Kairos",
      falaBee: "Fala Bee",
      statusBCR: "Estado BCR",
      statusZendesk: "Estado Zendesk"
    },
    home: "Inicio",
    solicitacoes: "Solicitudes",
    comunidade: "Comunidad",
    eventos: "Eventos",
    minhaArea: "Mi Área",
    meuPerfil: "Mi perfil",
    pesquisar: "Buscar",
    tituloModal: "Título",
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang.toLowerCase() || 'pt-br';
  const t = translations[lang] || translations["pt-br"];

  // ====== Banner de boas-vindas ======
  const userName = document.querySelector(".colaborador_name")?.textContent || '';
  const bannerH3 = document.querySelector(".user-banner h3");
  if (bannerH3) {
    bannerH3.innerHTML = `${t.greeting} <span class="colaborador_name">${userName}</span><br />${t.welcome}`;
  }
  
  const textHome =  document.querySelector("#menu-home span")
  if (textHome) textHome.textContent = t.home

  const textSolicitacoes =  document.querySelector("#toggle-solicitacoes span")
  if (textSolicitacoes) textSolicitacoes.textContent = t.solicitacoes

  const textComunidade =  document.querySelector("#menu-comunidade span")
  if (textComunidade) textComunidade.textContent = t.comunidade

  const textEventos =  document.querySelector("#toggle-eventos span")
  if (textEventos) textEventos.textContent = t.eventos

  const textMinhaArea =  document.querySelector("#menu-minha-area span")
  if (textMinhaArea) textMinhaArea.textContent = t.minhaArea

  const textMeuPerfil =  document.querySelector("#menu-perfil span")
  if (textMeuPerfil) textMeuPerfil.textContent = t.meuPerfil

  const textPesquisar =  document.querySelector("#menu-pesquisa")
  if (textPesquisar) textPesquisar.setAttribute("title", t.pesquisar)

  const textTituloModal =  document.querySelector("#titulo-modal-mobile")
  if (textTituloModal) textTituloModal.textContent = t.tituloModal
  // document.querySelector("#toggle-solicitacoes span")?.textContent = t.solicitacoes;
  // document.querySelector("#menu-comunidade span")?.textContent = t.comunidade;
  // document.querySelector("#toggle-eventos span")?.textContent = t.eventos;
  // document.querySelector("#menu-minha-area span")?.textContent = t.minhaArea;
  // document.querySelector("#menu-perfil span")?.textContent = t.meuPerfil;
  // document.querySelector("#menu-pesquisa")?.setAttribute("title", t.pesquisar);
  // document.querySelector("#titulo-modal-mobile")?.textContent = t.tituloModal;
  

  const bannerH4 = document.querySelector(".user-banner h4");
  if (bannerH4) bannerH4.textContent = t.subtitle;

  const seeMoreEl = document.querySelector(".vejamais p");
  if (seeMoreEl) seeMoreEl.textContent = t.seeMore;

  // ====== Links úteis ======
  const linksTitle = document.querySelector("#links-uteis");
  if (linksTitle) linksTitle.textContent = t.usefulLinks;

  // Ordem dos links na página:
  const linkLabels = [
    t.links.holerite,
    t.links.kairos,
    t.links.falaBee,
    t.links.statusBCR,
    t.links.statusZendesk
  ];

  document.querySelectorAll(".banner-links-dois .links-elementos p").forEach((el, idx) => {
    if (linkLabels[idx]) el.textContent = linkLabels[idx];
  });
});


// *---------------------------------*
// *-------- 🎲 ARM. DE DADOS -------*
// *---------------------------------*
let cachedTopics = [];
let allUsers = [];
let filteredUsers = [];
let allTopics = [];
let allHobbies = [];
let allHobbiesOptions = [];
let userMap = {};
let topicMap = {};
let mapVotes = {};
let currentUser = [];

let allBadges = [];

let filteredPosts = [];

let hobbiesCarregados = false;

let userLoggerId = "";

let searchResults = [];
let currentSearchPage = 0;
const resultsPerPage = 10; // Fecha o modal

const dadosSolicitacoes = [
  {
    texto: "Abrir uma Solicitação",
    link: "https://conecta.bcrcx.com/hc/pt-br/p/solicitacoes-areas",
    imagem: "/hc/theming_assets/01JFJG67584JR6RPYZPHF4JFW7",
  },
  {
    texto: "Minhas Solicitações",
    link: "https://conecta.bcrcx.com/hc/pt-br/requests",
    imagem: "/hc/theming_assets/01JFJG6B7PHCC6KJSKT1MC2JVZ",
  },
  {
    texto: "Solicitações da Minha Org",
    link: "https://conecta.bcrcx.com/hc/pt-br/requests?query=&page=1&selected_tab_name=org-requests&organization_id=",
    imagem: "/hc/theming_assets/01JFJG696FDPA0K1WBWWW6DHXA",
  },
];

// const dadosEventos = [
//   { texto: "Arraiá", emoji: "🎉" },
//   { texto: "Halloween", emoji: "🎃" },
//   { texto: "Festa do Pijama", emoji: "🧦" },
//   { texto: "Natal", emoji: "🎄" },
// ];

// testes de animações

  const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const sunIcon = `
      <circle cx="12" cy="12" r="4" stroke-width="2"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 2v2m0 16v2m4.24-1.76l1.42 1.42M4.34 4.34l1.42 1.42M20 12h2M2 12H0m1.76 4.24l1.42-1.42M17.66 4.34l1.42-1.42" />`;

    const moonIcon = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />`;

    // Detecta tema salvo ou sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('darkmode');
      themeIcon.innerHTML = moonIcon;
    }

    // Alternar tema
    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('darkmode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');

      // Animação GSAP
      gsap.to(themeIcon, {
        opacity: 0,
        rotate: 180,
        duration: 0.2,
        onComplete: () => {
          themeIcon.innerHTML = isDark ? moonIcon : sunIcon;
          gsap.fromTo(themeIcon, { opacity: 0, rotate: -180 }, { opacity: 1, rotate: 0, duration: 0.2 });
        }
      });
    }

    themeToggle.addEventListener('click', toggleTheme);

document.addEventListener("click", async (e) => {
  const botaoMais = e.target.closest(".show-more");
  const menuAberto = document.querySelector(".menu-acoes-post");

  // Fecha menu se clicar fora
  if (!botaoMais && menuAberto && !e.target.closest(".menu-acoes-post")) {
    menuAberto.remove();
    return;
  }

  if (botaoMais) {
  const postId = botaoMais.getAttribute("data-post-id");

  if (!postId) {
    console.warn("data-post-id não encontrado em .show-more");
    return;
  }

  const post = allPosts.find(p => String(p.id) === String(postId));

  console.log(`ID do post clicado: ${postId}`);
  console.log("Post encontrado:", post);

  if (!post) return;

  const isAutor = post.author_id == userLoggerId;
  const isAdmin = userMap[userLoggerId]?.role === "admin";

  console.log(`Usuário é autor? ${isAutor}`);
  console.log(`Usuário é admin? ${isAdmin}`);

  if (menuAberto) menuAberto.remove();

  if (isAutor || isAdmin) {
    const menu = document.createElement("div");
    menu.className =
      "menu-acoes-post absolute right-0 mt-2 w-55 bg-[var(--bg-base)] border-[var(--border-base)] rounded-[12px] shadow-2xl z-50 cursor-pointer";
    menu.innerHTML = `
      <button class="deletar-post text-red-600 p-2 w-full text-center font-bold hover:bg-[var(--bg-hover-element)] rounded-[12px]" data-post-id="${postId}">
        Deletar
      </button>
      <hr />
      <button class="reportar-post text-[var(--text-base)] p-2 w-full text-center font-bold hover:bg-[var(--bg-hover-element)] rounded-[12px]" data-post-id="${postId}">
        Reportar
      </button>
    `;
    botaoMais.appendChild(menu);
  }
}

  // Clique em "Excluir"
  if (e.target.classList.contains("deletar-post")) {
    const postId = e.target.getAttribute("data-post-id");
    const confirmed = confirm("Tem certeza que deseja excluir esta postagem?");
    if (!confirmed) return;

    try {
      const credentials_user = btoa(`fabio.santos@bcrcx.com/token:${token}`);
      const response = await fetch(`/api/v2/community/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${credentials_user}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        document.querySelector(`.postagem[data-post-id="${postId}"]`)?.remove();
        alert("Postagem excluída com sucesso.");
      } else {
        alert("Erro ao excluir. Verifique permissões ou tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao excluir post:", err);
      alert("Erro ao excluir. Verifique o console.");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelector(".links-principal");
  const heroInner = document.querySelector(".hero-inner");
  const container = document.querySelector(".container");

  // Cria um marcador para onde voltar com facilidade
  const originalPlaceholder = document.createElement("div");
  originalPlaceholder.style.display = "none";

  if (!heroInner) return;

  heroInner.insertBefore(originalPlaceholder, links);

  gsap.matchMedia().add(
    {
      isMobile: "(max-width: 1028px)",
      isDesktop: "(min-width: 1029px)",
    },
    (context) => {
      const { isMobile, isDesktop } = context.conditions;

      if (isMobile) {
        // Remove classe de posição fixa
        links.classList.remove("absolute", "bottom-0", "w-[80%]");
        links.classList.add("mt-6", "w-full");

        // Move para o final da .container
        container.appendChild(links);
      }

      if (isDesktop) {
        // Restaura estilos
        links.classList.add("absolute", "bottom-0", "w-[80%]");
        links.classList.remove("mt-6", "w-full");

        // Move de volta para a posição original
        heroInner.insertBefore(links, originalPlaceholder.nextSibling);
      }
    }
  );
});

const cameFromTicketCreation = () => {
  const ref = document.referrer;
  return ref.includes("/requests/new") && ref.includes("ticket_form_id=");
};

const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  const regex = /\/requests\/\d+$/;

  if (regex.test(currentUrl) && cameFromTicketCreation()) {
    observer.disconnect();

    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: sans-serif;
        font-size: 1.5rem;">
        Redirecionando, aguarde...
      </div>
    `;

    window.location.href =
      "https://conecta.bcrcx.com/hc/pt-br/p/successful-request";
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

let tl_pag_request = gsap.timeline();
// Animação do checkmark
tl_pag_request
  .from("#checkmark", {
    scale: 0,
    opacity: 0,
    ease: "back.out(1.7)",
    duration: 0.8,
  })
  .from("#h1_successful_request", {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  })
  .from("#p_successful_request", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  })
  .from(
    "#btn_successful_request",
    {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: "back.in(1.7)",
    },
    "<"
  );

document.documentElement.classList.toggle("dark");

// *---------------------------------*
// *----- 💢 FUNÇÕES AUXILIARES ----*
// *---------------------------------*

function irParaHome() {
  fecharModalMobile();
  ativarIconeMobile("btn-mobile-home");
  window.location.href = "https://conecta.bcrcx.com/hc/pt-br#main-content";
}

function irParaComunidade() {
  fecharModalMobile();
  ativarIconeMobile("btn-mobile-comunidade");
  window.location.href =
    "https://conecta.bcrcx.com/hc/pt-br#container-community";
}

let tipoModalAtivo = null;

function abrirModalMobile(tipo) {
  const modal = document.getElementById("modal-mobile");
  const titulo = document.getElementById("titulo-modal-mobile");
  const conteudo = document.getElementById("conteudo-modal-mobile");
  const content = modal.querySelector(".modal-content");

  // Se o mesmo botão for clicado novamente, apenas fecha
  if (modal.style.display === "flex" && tipoModalAtivo === tipo) {
    fecharModalMobile();
    return;
  }

  // Se já houver outro modal aberto, fecha primeiro, depois reabre com novo conteúdo
  if (modal.style.display === "flex" && tipoModalAtivo !== tipo) {
    gsap.to(content, {
      y: "100%",
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = "none";
        setTimeout(() => abrirModalMobile(tipo), 50); // reabre com novo tipo
      },
    });
    return;
  }

  tipoModalAtivo = tipo;
  modal.style.display = "flex";

  // Animação de entrada
  gsap.fromTo(
    content,
    { y: "100%", opacity: 0 },
    { y: "0%", opacity: 1, duration: 0.4, ease: "power2.out" }
  );

  // Define título e conteúdo
  conteudo.innerHTML = "";

  if (tipo === "solicitacoes") {
    titulo.textContent = "Solicitações";
    const lista = criarListaSolicitacoes();
    lista
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", () => fecharModalMobile()));
    conteudo.appendChild(lista);
    ativarIconeMobile("btn-mobile-solicitacoes");
  } else if (tipo === "eventos") {
    titulo.textContent = "Eventos";
    carregarEventosMobile(() => fecharModalMobile());
    ativarIconeMobile("btn-mobile-eventos");
  }
}

function fecharModalMobile() {
  const modal = document.getElementById("modal-mobile");
  const content = modal.querySelector(".modal-content");
  tipoModalAtivo = null;

  gsap.to(content, {
    y: "100%",
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modal.style.display = "none";
    },
  });

  // Reseta ícones
  resetarIconesMobile();
}

function carregarEventosMobile(onClickItem) {
  const sectionId = 37137115626260;
  const url = `/api/v2/help_center/sections/${sectionId}/articles.json`;
  const container = document.getElementById("conteudo-modal-mobile");
  container.innerHTML = "<li>Carregando eventos...</li>";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = "";
      data.articles.forEach((article) => {
        const li = document.createElement("li");
        li.className =
          "side-list flex gap-3 items-center p-2 hover:bg-gradient-to-l hover:from-[#699ceb] hover:to-[#718fff] rounded-[20px] cursor-pointer transition duration-300";

        li.innerHTML = `
          <i class="text-[1.7rem]/[40px] text-center w-[40px] h-[40px]">📅</i>
          <span class="sidebar-text">${article.title}</span>
        `;

        li.addEventListener("click", () => {
          onClickItem?.();
          window.location.href = `/hc/pt-br/articles/${article.id}`;
        });

        container.appendChild(li);
      });
    })
    .catch(() => {
      container.innerHTML = "<li>Erro ao carregar eventos.</li>";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // ADD POST - Função que você irá definir depois
  document.getElementById("btn-add-post")?.addEventListener("click", () => {
    abrirFormularioNovaPostagem(); // Função que você irá configurar
  });
});

// Exemplo de modal simples reutilizável
function abrirModalSubmenu(tipo) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center";
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-xl shadow-md w-[90%] max-w-md relative">
      <button onclick="this.parentElement.parentElement.remove()" class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">&times;</button>
      <h2 class="text-xl font-bold mb-4">${
        tipo === "solicitacoes" ? "Solicitações" : "Eventos"
      }</h2>
      <ul class="space-y-2">
        ${
          tipo === "solicitacoes"
            ? `
          <li><a href="/hc/pt-br/requests/new" class="text-blue-600 hover:underline">Nova solicitação</a></li>
          <li><a href="/hc/pt-br/requests" class="text-blue-600 hover:underline">Minhas solicitações</a></li>
        `
            : `
          <li><a href="/hc/pt-br/categories/ID-EVENTOS" class="text-blue-600 hover:underline">Todos os eventos</a></li>
          <li><a href="/hc/pt-br/articles/ID-PROXIMO-EVENTO" class="text-blue-600 hover:underline">Próximo evento</a></li>
        `
        }
      </ul>
    </div>
  `;
  document.body.appendChild(modal);
}

const iconesMobile = {
  "btn-mobile-home": {
    normal: "/hc/theming_assets/01JVYXYP5K3Q487VQ5HRWAQHB7",
    ativo: "/hc/theming_assets/01JVYXYQ6Q37H7V4FF2JGNRZ19",
  },
  "btn-mobile-solicitacoes": {
    normal: "/hc/theming_assets/01JVYXYR5K9J8N52J06XJEXW6F",
    ativo: "/hc/theming_assets/01JVYXYS3HXAFN1YF0B4CNZ8BS",
  },
  "btn-mobile-comunidade": {
    normal: "/hc/theming_assets/01JVYXYJJV435GSK63QP9K83FM",
    ativo: "/hc/theming_assets/01JVYXYM6ED08799KWT3YHKQ9X",
  },
  "btn-mobile-eventos": {
    normal: "/hc/theming_assets/01JW4M0J3JCXTPYACKGTYHFA7S",
    ativo: "/hc/theming_assets/01JW73NNTZ9YF0DBDHJ139318N",
  },
  "btn-mobile-add": {
    normal: "/hc/theming_assets/01JXD8ENQ506WT3Y98ZZPE2FT5",
    ativo: "/hc/theming_assets/01JXD8ENQ506WT3Y98ZZPE2FT5",
  },
  "btn-mobile-minha-area": {
    normal:
      "https://conecta.bcrcx.com/hc/theming_assets/01K1DQ8012FQKKYZBHA72FTAQQ",
    ativo:
      "https://conecta.bcrcx.com/hc/theming_assets/01K1DQ7Z2J61YAWJWCB6AK4GA5",
  },
};

function resetarIconesMobile() {
  Object.keys(iconesMobile).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      const img = btn.querySelector("img");
      if (img) img.src = iconesMobile[id].normal;
    }
  });
}

function ativarIconeMobile(idAtivo) {
  resetarIconesMobile();
  const btn = document.getElementById(idAtivo);
  if (btn) {
    const img = btn.querySelector("img");
    if (img) img.src = iconesMobile[idAtivo].ativo;
  }
}

// Funções auxiliares

async function abrirMenuUsuarioExterno(userId) {
  const modalEl = document.getElementById("modal-user-externo");
  const contentEl = document.getElementById("menu-user-externo-conteudo");
  modalEl.classList.remove("hidden");

  const user = userMap[userId];
  if (!user) {
    contentEl.innerHTML = `<p class="text-white text-center mt-4">Usuário não encontrado no cache.</p>`;
    return;
  }

  const initials = capturarIniciais(user.name);
  const hasPhoto = user.photo?.mapped_content_url;
  const photo = hasPhoto ? user.photo.mapped_content_url : "";

  const badgeHTML = montarBadgesHTML(user.badges, user.extraBadges);

  // Busca apenas as contagens dinâmicas
  let postCount = 0;
  let followerCount = 0;
  let followingCount = 0;

  try {
    const [postsRes, followersRes, followingsRes] = await Promise.all([
      fetch(`/api/v2/community/users/${user.id}/posts`),
      fetch(
        `/api/v2/help_center/users/${user.id}/user_subscriptions?type=followers`
      ),
      fetch(
        `/api/v2/help_center/users/${user.id}/user_subscriptions?type=followings`
      ),
    ]);

    const postsData = await postsRes.json();
    const followersData = await followersRes.json();
    const followingsData = await followingsRes.json();

    postCount = postsData.posts?.length || 0;
    followerCount = followersData.user_subscriptions?.length || 0;
    followingCount = followingsData.user_subscriptions?.length || 0;
  } catch (err) {
    console.warn("Erro ao buscar contagens dinâmicas:", err);
  }

  document.getElementById("btn-fechar-busca").addEventListener("click", () => {
    document.getElementById("user-search-modal").classList.add("hidden");
  });

  // Fecha o modal
  document.getElementById("btn-fechar-busca").addEventListener("click", () => {
    document.getElementById("user-search-modal").classList.add("hidden");
  });

  // Botão "Carregar mais"
  document.getElementById("btn-carregar-mais").addEventListener("click", () => {
    currentSearchPage++;
    renderizarResultadosPaginados();
  });

  // Gera hobbies
  const hobbiesSelecionados = user.user_fields.user_hobbies || [];
  const hobbiesHTML = hobbiesSelecionados
    .map((hobbieValue) => {
      const hobbie = allHobbiesOptions.find((opt) => opt.value === hobbieValue);
      return hobbie
        ? `<li class="list select-none flex items-center gap-1 bg-[var(--bg-hobbies)] shadow-md shadow-indigo-500/50">${hobbie.name}</li>`
        : "";
    })
    .join("");

  // Monta HTML
  const html = `
  	<div id="search-menu-user" class="absolute backdrop-blur-[5px] bg-black/20 flex h-[60px] items-center justify-center rounded-b-xl row-span-1 shadow-indigo-950/25 shadow-xl w-full z-5">
      <input type="text" placeholder="Pesquisar usuários..." class="user-search-input rounded-md bg-[url(/hc/theming_assets/01JT9CP4K6HA41BV42EQV1Z66J)] px-3 py-1 max-w-md bg-white text-black placeholder-gray-500 focus:outline-none">
    </div>
    <div id="banner" class="user-banner row-span-1 ${
      user.user_fields.banner_user ||
      "bg-gradient-to-tr from-neutral-500 to-neutral-800"
    }">
      <button id="btn-voltar-user" class="absolute top-4 left-4 text-white text-[1.6rem] z-10 cursor-pointer hover:bg-gradient-to-l hover:bg-[#ffffff05] rounded-[20px] cursor-pointer p-1 transition duration-300 shadow-[#e4e4e463] shadow-sm hover:shadow-[#ffffff50] hover:shadow-lg" title="Voltar para meu perfil">
        <i class="bi bi-chevron-left text-[1.3rem] text-white"></i>
      </button>
      <div class="user-initials w-21 h-21 md:w-21 md:h-21 lg:w-21 lg:h-21 2xl:w-23 2xl:h-23 ${
        hasPhoto ? "hidden" : ""
      }">
        ${initials}
      </div>
      <img class="user-avatar w-22 h-22 md:w-26 md:h-26 lg:w-25 lg:h-25 2xl:w-32 2xl:h-32 bottom-[-50px] absolute"
        src="${photo}" 
        alt="${user.name}" 
        style="${hasPhoto ? "" : "display: none"};">
    </div>

    <div class="menu-bottom overflow-auto p-[1rem]">
      <div class="user-information-main">
        <div class="flex gap-4 items-center">
          <h2>${user.name}</h2>
          <ul aria-label="Medalhas" class="community-badge-titles">
            <li class="community-badge" title="" aria-label="">
              ${badgeHTML}
            </li>
          </ul>
        </div>
        <div class="menu-user-infos select-none">
          <div class="user-info user-posts">
            <h3>Postagens</h3>
            <p>${postCount}</p>
          </div>
          <div class="user-info user-followers">
            <h3>Seguidores</h3>
            <p>${followerCount}</p>
          </div>
          <div class="user-info user-following">
            <h3>Seguindo</h3>
            <p>${followingCount}</p>
          </div>
        </div>
      </div>
      <div class="h-[1px] flex items-center justify-center w-[80%] my-5 mx-auto bg-[#00000020] rounded-xl">
      	<a href="/hc/pt-br/profiles/${
          user.id
        }" class="view-profile py-1 px-4 bg-[#1d5abc] rounded-[12px] text-white text-[.75rem] shadow-xl visited:text-white active:text-white">VIEW PROFILE</a>
      </div>

      <div class="menu-user-about">
        <div class="aboutMe">
          <span>Sobre mim</span>
          <p class="font-[atlassian_sans]">${
            user.user_fields.user_descricao || "Sem descrição"
          }</p>
        </div>
        <ul class="menu-user-hobbies">
          ${hobbiesHTML}
        </ul>
      </div>
    </div>
  `;

  contentEl.innerHTML = html;
  bindEventosBuscaUsuarios();

  // Botão de voltar

  document.getElementById("btn-voltar-user").addEventListener("click", () => {
    modalEl.classList.add("hidden");
  });
}

// Função de renderização com paginação
function renderizarResultadosPaginados() {
  const container = document.getElementById("search-results-container");
  const start = currentSearchPage * resultsPerPage;
  const end = start + resultsPerPage;
  const pageItems = searchResults.slice(start, end);

  const elementosCriados = [];

  pageItems.forEach((user, index) => {
    const hasPhoto = user.photo?.mapped_content_url;
    const photo = hasPhoto
      ? `<img src="${user.photo.mapped_content_url}" class="w-10 h-10 rounded-full">`
      : `<div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">${capturarIniciais(
          user.name
        )}</div>`;

    const el = document.createElement("div");
    el.className =
      "flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-hover-element)] p-2 rounded opacity-0";
    el.innerHTML = `${photo}<span class="text-[var(--text-base)]">${user.name}</span>`;

    el.addEventListener("click", () => {
      document.getElementById("user-search-modal").classList.add("hidden");
      abrirMenuUsuarioExterno(user.id);
    });

    container.appendChild(el);
    elementosCriados.push(el);
  });

  // 🎬 Aplica animação em sequência com GSAP
  gsap.fromTo(
    elementosCriados,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.15,
    }
  );

  const btnMais = document.getElementById("btn-carregar-mais");
  if (searchResults.length > end) {
    btnMais.classList.remove("hidden");
  } else {
    btnMais.classList.add("hidden");
  }
}

// Embaralha array aleatoriamente (Fisher–Yates)
function shuffleArray(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bindEventosBuscaUsuarios() {
  const inputs = document.querySelectorAll(".user-search-input");
  const modal = document.getElementById("user-search-modal");
  const container = document.getElementById("search-results-container");
  const btnFechar = document.getElementById("btn-fechar-busca");
  const btnMais = document.getElementById("btn-carregar-mais");
  const inputModal = document.getElementById("barra-pesquisa-user");

  if (
    !inputs.length ||
    !modal ||
    !container ||
    !btnFechar ||
    !btnMais ||
    !inputModal
  ) {
    console.warn("Elementos de busca de usuário não encontrados no DOM.");
    return;
  }

  let fullUserList = shuffleArray(Object.values(userMap));
  searchResults = [...fullUserList];
  currentSearchPage = 0;

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      modal.classList.remove("hidden");
      inputModal.value = "";
      searchResults = [...fullUserList];
      currentSearchPage = 0;
      container.innerHTML = "";
      renderizarResultadosPaginados();
    });
  });

  inputModal.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    searchResults = fullUserList.filter((user) =>
      user.name.toLowerCase().includes(termo)
    );
    currentSearchPage = 0;
    container.innerHTML = "";
    renderizarResultadosPaginados();
  });

  btnFechar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  btnMais.addEventListener("click", () => {
    currentSearchPage++;
    renderizarResultadosPaginados();
  });
}

function formatarDataHoraCompleta(dataISO) {
  const data = new Date(dataISO);
  const hora = data
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(".", "")
    .toUpperCase();

  const dia = data
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/de /g, "de ");

  return `${hora} . ${dia}`;
}

function enviarComentarioPopup() {
  const comentario = document.getElementById("autoGrowTextarea").value.trim();

  if (!comentario || !postIdAtivo) {
    // alert("Adicione um comentário");
    return;
  }

  const parametros = {
    comment: {
      body: comentario,
      notify_subscribers: false,
      author_id: userLoggerId,
    },
  };

  fetch(`/api/v2/community/posts/${postIdAtivo}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(parametros),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Comentário enviado no popup:", data);
      document.getElementById("autoGrowTextarea").value = "";
      carregarComentarios(postIdAtivo);
    })
    .catch((err) => {
      console.error("Erro ao comentar no popup:", err);
    });
}

// Função para enviar o comentário GUSTAVO
function enviarComentarioFeed(botao) {
  const postagemEl = botao.closest(".postagem");
  if (!postagemEl) {
    console.error("Postagem não encontrada!");
    return;
  }

  const postId = postagemEl.getAttribute("data-post-id");
  const textarea = postagemEl.querySelector(".auto-resize");
  const comentario = textarea.value.trim();

  if (!comentario) {
    // alert("Adicione um comentário");
    return;
  }

  const parametros = {
    comment: {
      body: comentario,
      notify_subscribers: false,
      author_id: userLoggerId,
    },
  };

  fetch(`/api/v2/community/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(parametros),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erro HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Comentário enviado no feed:", data);
      textarea.value = "";
      textarea.style.height = "auto";
      carregarComentarios(postId); // mesma função usada no popup?
    })
    .catch((err) => {
      console.error("Erro ao comentar no feed:", err);
    });
}

function safeQuery(selector) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`Elemento não encontrado: ${selector}`);
  }
  return el;
}

const saveToCache = (key, data, ttl = 3600000) => {
  const record = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  localStorage.setItem(key, JSON.stringify(record));
};

const loadFromCache = (key) => {
  const record = JSON.parse(localStorage.getItem(key));
  if (!record) return null;

  const isExpired = Date.now() - record.timestamp > record.ttl;
  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }
  return record.data;
};

const getUsersWithCache = async () => {
  const cachedUsers = loadFromCache("usersWithBadges");
  if (cachedUsers) return cachedUsers;

  const users = await getUsers(); // sua função que já retorna os usuários com suas badges atribuídas
  saveToCache("usersWithBadges", users);
  return users;
};

function debounce(func, wait = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function criarListaSolicitacoes() {
  const ul = document.createElement("ul");
  ul.className =
    "ml-6 mt-2 flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out";

  dadosSolicitacoes.forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "p-2 relative hover:bg-gradient-to-l hover:from-[#699ceb] hover:to-[#718fff] rounded-[20px] cursor-pointer transition duration-300";

    li.innerHTML = `
      <a href="${item.link}" class="side-list flex items-center gap-3 p-2">
        <i class="w-[40px]">
          <img src="${item.imagem}" alt="${item.texto}" class="image-monstrinhos rounded-[50%] bg-white" />
        </i>
        <span class="sidebar-text">${item.texto}</span>
      </a>
    `;

    ul.appendChild(li);
  });

  return ul;
}

function carregarEventosSidebar() {
  const sectionId = 37137115626260;
  const url = `/api/v2/help_center/sections/${sectionId}/articles.json`;
  const submenu = document.getElementById("submenu-content");
  submenu.innerHTML = ""; // Limpa conteúdo antigo

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      data.articles.forEach((article) => {
        const li = document.createElement("li");
        li.className =
          "side-list flex gap-3 items-center w-full p-2 hover:bg-gradient-to-l hover:from-[#699ceb] hover:to-[#718fff] rounded-[20px] cursor-pointer transition duration-300";

        li.innerHTML = `
          <i class="text-[1.7rem]/[40px] text-center w-[40px] h-[40px]">📅</i>
          <span class="sidebar-text">${article.title}</span>
        `;

        li.addEventListener("click", () => {
          fetch(`/api/v2/help_center/articles/${article.id}.json`)
            .then((resp) => resp.json())
            .then((json) => {
              const artigo = json.article;
              const detalhes = document.querySelector(".eventos"); // ou onde deseja exibir
              detalhes.innerHTML = `
                <h2>${artigo.title}</h2>
                <div>${artigo.body}</div>
              `;
            })
            .catch(console.error);
        });

        submenu.appendChild(li);
      });
    })
    .catch(console.error);
}

const textarea = document.querySelector(".auto-resize");
if (textarea) {
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto"; // reseta antes de crescer
    textarea.style.height = textarea.scrollHeight + "px";
  });
}

async function atualizarDadosAutorPost() {
  const nomeEl = document.getElementById("nome_autor_post");
  const fotoEl = document.getElementById("foto_autor_post");
  const iniciaisEl = document.getElementById("iniciais_autor_post");

  // Atualiza nome e link
  console.log(currentUser.user.name);
  nomeEl.textContent = currentUser.user.name;
  nomeEl.href = `/hc/pt-br/profiles/${currentUser.user.id}`;

  const hasPhoto =
    currentUser.user.photo && currentUser.user.photo.mapped_content_url;

  if (hasPhoto) {
    fotoEl.src = currentUser.user.photo.mapped_content_url;
    fotoEl.alt = currentUser.user.name;
    fotoEl.style.display = "block";
    iniciaisEl.style.display = "none";
  } else {
    // Mostra iniciais se não tiver foto
    const iniciais = capturarIniciais(currentUser.user.name);
    iniciaisEl.textContent = iniciais;
    fotoEl.style.display = "none";
    iniciaisEl.style.display = "flex";
  }
}

let loadingAnimation; // fora de qualquer função

function showLoading() {
  const overlay = document.getElementById("loading_overlay");
  if (!overlay) return;

  overlay.classList.remove("hidden");

  let loading_logo_1 = document.getElementById("loading-logo-1");
  let loading_logo_2 = document.getElementById("loading-logo-2");
  let loading_logo_3 = document.getElementById("loading-logo-3");
  let loading_logo_4 = document.getElementById("loading-logo-4");
  let loading_text = document.getElementById("loading-text");

  // ✅ Mata a animação anterior, se existir
  if (loadingAnimation) {
    loadingAnimation.kill();
  }

  const split = new SplitText(loading_text, { type: "chars" });

  // ✅ Cria nova timeline e salva na variável global
  loadingAnimation = gsap.timeline();

  loadingAnimation
    .fromTo(
      loading_logo_1,
      { yPercent: 0, xPercent: 0, scale: 1 },
      {
        yPercent: -5,
        xPercent: -5,
        scale: 1.1,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.2,
        ease: "none",
      }
    )
    .fromTo(
      loading_logo_2,
      { yPercent: 0, xPercent: 0, scale: 1 },
      {
        yPercent: -5,
        xPercent: 5,
        scale: 1.1,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.2,
        ease: "none",
      }
    )
    .fromTo(
      loading_logo_4,
      { yPercent: 0, xPercent: 0, scale: 1 },
      {
        yPercent: 5,
        xPercent: 5,
        scale: 1.1,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.2,
        ease: "none",
      }
    )
    .fromTo(
      loading_logo_3,
      { yPercent: 0, xPercent: 0, scale: 1 },
      {
        yPercent: 5,
        xPercent: -5,
        scale: 1.1,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.2,
        ease: "none",
      }
    );

  // texto animado
  gsap.from(split.chars, {
    yPercent: -10,
    opacity: 0,
    duration: 0.3,
    repeat: -1,
    stagger: {
      amount: 0.4,
    },
  });
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loading_overlay");
  if (loadingOverlay) {
    loadingOverlay.classList.add("hidden");
  } else {
    console.warn("Elemento #loading_overlay não encontrado no DOM.");
  }
}

// Função para enviar o comentário GUSTAVO
function enviarComentario(botao) {
  // Encontra a postagem mais próxima a partir do botão clicado
  const postagem = botao.closest(".postagem");

  if (!postagem) {
    console.error("Elemento .postagem não encontrado!");
    return;
  }

  // Pega o texto do comentário desta postagem
  const comentario = postagem.querySelector(".auto-resize").value.trim();

  if (comentario) {
    const postId = postagem.getAttribute("data-post-id");

    const parametros = {
      comment: {
        body: comentario,
        author_id: userLoggerId,
        notify_subscribers: false,
      },
    };

    fetch(`/api/v2/community/posts/${postId}/comments`, {
      method: "POST",
      headers: {},
      body: JSON.stringify(parametros),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Comentário enviado com sucesso:", data);
        postagem.querySelector(".auto-resize").value = "";
      })
      .catch((error) => {
        console.error("Erro ao enviar comentário:", error);
      });
  } else {
    alert("Por favor, adicione um comentário antes de enviar!");
  }
}

// Adiciona o evento de clique no ícone de envio

function abrirModalEditarPerfil(user) {
  const descricaoInput = document.getElementById("user_descricao");
  const bannerInput = document.getElementById("input_banner");
  const bannerModel = document.querySelector(".modal-banner");

  const contador = document.getElementById("quant-caracteres");

  renderizarHobbiesModal(user.user_fields.user_hobbies || []);

  descricaoInput.addEventListener("input", () => {
    const total = descricaoInput.value.length;
    contador.textContent = `${total} / 300 caracteres`;
  });

  descricaoInput.value = user.user_fields.user_descricao || "";
  bannerInput.value = user.user_fields.banner_user || "";

  // Limpa classes de background anteriores do bannerModel
  bannerModel.className =
    "modal-banner w-full h-50 relative flex items-end justify-center mb-8";

  let bannerClass = user.user_fields.banner_user;

  if (!bannerClass) {
    // Define um padrão se não houver
    bannerClass = "bg-gradient-to-tr from-gray-500 to-gray-800";
  }

  // Aplica as classes ao banner
  bannerModel.classList.add(...bannerClass.split(" "));

  // Atualiza a referência para o controle de remoção depois
  previousBannerClass = bannerClass;

  const modal_edit_user = document.getElementById("modal-editar-perfil");
  modal_edit_user.style.display = "flex";
  const modal_content_all = document.querySelector(".modal-content-all");

  gsap.fromTo(
    ".modal-content-all",
    {
      opacity: 0,
      scale: 0.7,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  gsap.fromTo(
    ".modal-banner",
    { opacity: 0, y: -30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.4,
    }
  );

  document.body.style.overflow = "hidden";
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const agora = new Date();
  const diffMs = agora - data;

  const segundos = Math.floor(diffMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  if (segundos < 60) {
    return "Agora mesmo";
  } else if (minutos < 60) {
    return `${minutos} minuto(s) atrás`;
  } else if (horas < 24) {
    return `${horas} hora(s) atrás`;
  } else if (dias < 7) {
    return `${dias} dia(s) atrás`;
  } else if (dias < 30) {
    return `${semanas} semana(s) atrás`;
  } else if (dias < 365) {
    return `${meses} mês(es) atrás`;
  } else {
    return `${anos} ano(s) atrás`;
  }
}

function capturarIniciais(nomeCompleto) {
  const preposicoes = ["de", "da", "do", "das", "dos"];
  const partes = nomeCompleto.trim().split(/\s+/);
  const nomesValidos = partes.filter(
    (parte) => !preposicoes.includes(parte.toLowerCase())
  );
  const inicialPrimeiroNome = nomesValidos[0]?.charAt(0).toUpperCase() || "";
  const inicialSegundoNome = nomesValidos[1]?.charAt(0).toUpperCase() || "";
  return inicialPrimeiroNome + inicialSegundoNome;
}

function abreviarNomeFormatado(nomeCompleto) {
  const preposicoes = ["de", "da", "do", "das", "dos"];
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const partes = nomeCompleto.trim().split(/\s+/);
  const nomesValidos = partes.filter(
    (parte) => !preposicoes.includes(parte.toLowerCase())
  );
  const primeiro = nomesValidos[0] ? capitalize(nomesValidos[0]) : "";
  const segundo = nomesValidos[1] ? capitalize(nomesValidos[1]) : "";
  return segundo ? `${primeiro} ${segundo}` : primeiro;
}

function toggleDescricao(postId) {
  const shortEl = document.getElementById(`desc-short-${postId}`);
  const fullEl = document.getElementById(`desc-full-${postId}`);
  const button = shortEl.parentElement.querySelector(".ver-mais");

  const isExpanded = fullEl.style.display === "inline";

  fullEl.style.display = isExpanded ? "none" : "inline";
  shortEl.style.display = isExpanded ? "inline" : "none";
  button.textContent = isExpanded ? "Ver mais" : "Ver menos";
}

// Função para parsear os detalhes dos posts
function parseHTMLDetails(details) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(details, "text/html");

  const paragraphs = Array.from(doc.querySelectorAll("p"))
    .map((p) => p.textContent.trim())
    .filter((p) => p);

  const images = Array.from(doc.querySelectorAll("img")).map((img) => img.src);

  return { paragraphs, images };
}

function moveSlide(direction, slideId, button) {
  const slide = document.getElementById(slideId);
  const images = slide.querySelectorAll("img");
  console.log(slide);
  console.log(images);
  const containerWidth = slide.offsetWidth; // ✅ mais confiável que image.clientWidth
  const maxIndex = images.length - 1;

  let currentIndex = parseInt(slide.dataset.index || "0");
  currentIndex += direction;
  currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

  slide.dataset.index = currentIndex;

  // 🔄 Aplica o deslocamento horizontal
  slide.style.transform = `translateX(-${containerWidth * currentIndex}px)`;

  // Mostrar ou esconder botões
  const container = slide.closest(".carrossel");
  const leftBtn = container.querySelector(".carrossel-button-left");
  const rightBtn = container.querySelector(".carrossel-button-right");

  if (leftBtn) leftBtn.classList.toggle("hidden", currentIndex === 0);
  if (rightBtn) rightBtn.classList.toggle("hidden", currentIndex === maxIndex);
}

function montarBadgesHTML(badges, extraBadges = 0) {
  if (!badges || badges.length === 0) {
    return `<i class="no-badge bi bi-award" title="Não possui medalhas no momento."></i>`;
  }

  let badgesHTML = "";

  badges.forEach((badge) => {
    badgesHTML += `
      <img src="${badge.iconUrl}" alt="${badge.name}" class="badge-icon w-[25px] rounded-[50%] border-1 border-[#00000070]">
    `;
  });

  if (extraBadges > 0) {
    badgesHTML += `<span class="extra-badges text-sm text-gray-600 ml-1">+${extraBadges}</span>`;
  }

  return badgesHTML;
}

// *---------------------------------*
// *------ 📬 REQUISIÇÕES API ------*
// *---------------------------------*
async function renderizarHobbiesModal(hobbiesSelecionados = []) {
  const container = document.getElementById("hobbies-container");
  if (!container) return;

  // try {
  // const res = await fetch("/api/v2/user_fields/37130447328916");
  // const data = await res.json();
  // const options = data.user_field.custom_field_options;

  const html = allHobbiesOptions
    .map((opt) => {
      const id = opt.value.replace("user_hobbie_", ""); // ex: "jogos"
      return `
          <div class="hobbie_content">
            <input
              id="${id}"
              class="sr-only peer"
              type="checkbox"
              value="${opt.value}"
            />
            <label
              for="${id}"
              class="p-2 border-solid border-2 bg-gray-700 rounded-3xl peer-checked:border-blue-500 peer-checked:bg-indigo-600 peer-checked:shadow-md peer-checked:shadow-indigo-500/50 transition duration-300 cursor-pointer hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/50"
            >${opt.name}</label>
          </div>
        `;
    })
    .join("");

  container.innerHTML = html;

  const checkboxes = container.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((cb) => {
    cb.checked = hobbiesSelecionados.includes(cb.value);
    console.log(cb.checked);
    console.log(hobbiesSelecionados.includes(cb.value));
  });
}

const getVotesForPost = async (postId) => {
  try {
    const response = await fetch(`/api/v2/community/posts/${postId}/votes`, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erro ao buscar votos:", response.statusText);
      return []; // Garante que retorna array
    }

    const data = await response.json();
    if (!Array.isArray(data.votes)) return []; // Garante que votes seja array

    return data.votes;
  } catch (err) {
    console.error("Erro inesperado:", err);
    return []; // Retorna array mesmo com erro
  }
};

const loadAllBadges = async () => {
  const cachedBadges = loadFromCache("allBadges");
  if (cachedBadges) {
    allBadges = cachedBadges;
    return;
  }

  const response = await fetch("/api/v2/gather/badges", {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  allBadges = data.badges;
  saveToCache("allBadges", allBadges);
};

const getUsers = async () => {
  let nextPage = "/api/v2/search.json?query=status_colaborador:ativo&type=user";

  while (nextPage) {
    const response = await fetch(nextPage, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    allUsers = [...allUsers, ...data.results];
    nextPage = data.next_page;
  }

  const usersWithBadges = await Promise.all(
    allUsers.map(async (user) => {
      const badgeResponse = await fetch(
        `/api/v2/gather/badge_assignments?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      const badgeData = await badgeResponse.json();

      const badgesInfo = badgeData.badge_assignments
        .slice(0, 3)
        .map((assignment) => {
          const badge = allBadges.find((b) => b.id === assignment.badge_id);
          return badge
            ? {
                name: badge.name,
                iconUrl: badge.icon_url,
                description: badge.description,
              }
            : null;
        })
        .filter(Boolean);

      const totalBadges = badgeData.badge_assignments.length;
      const extraBadges = totalBadges > 3 ? totalBadges - 3 : 0;

      return {
        ...user,
        badges: badgesInfo,
        extraBadges, // novo campo numérico
      };
    })
  );

  return usersWithBadges;
};

// const bannerBtn = document.getElementById("dropdownBannerBtn");
const bannerMenu = document.getElementById("dropdownBannerMenu");
const bannerInput = document.getElementById("input_banner");
const bannerModel = document.querySelector(".modal-banner");

let previousBannerClass = ""; // guarda a classe anterior para remover depois

if (bannerMenu && bannerInput && bannerModel) {
  bannerMenu.querySelectorAll("[data-value]").forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");
      const bannerClass = option.getAttribute("data-value");

      // Atualiza o valor oculto
      bannerInput.value = value;

      // Atualiza destaque visual da opção
      bannerMenu.querySelectorAll("[data-value]").forEach((el) => {
        el.classList.remove("ring-2", "ring-blue-500", "bg-blue-50");
      });
      option.classList.add("ring-2", "ring-blue-500", "bg-blue-50");

      // Remove a classe anterior do banner (se houver)
      if (previousBannerClass) {
        bannerModel.classList.remove(...previousBannerClass.split(" "));
      }

      // Adiciona a nova classe
      bannerModel.classList.add(...bannerClass.split(" "));
      previousBannerClass = bannerClass; // atualiza referência
    });
  });
}

async function salvarPerfil() {
  const descricao = document.getElementById("user_descricao").value.trim();
  const banner = document.getElementById("input_banner").value;

  // Pegar até 10 hobbies marcados
  const selectedHobbies = Array.from(
    document.querySelectorAll("#hobbies-container input[type=checkbox]:checked")
  )
    .map((cb) => cb.value)
    .slice(0, 10);

  const payload = {
    user: {
      user_fields: {
        user_descricao: descricao,
        banner_user: banner,
        user_hobbies: selectedHobbies,
      },
    },
  };

  console.log(payload);

  const credentials_user = btoa(
    `${userMap[userLoggerId].email}/token:${token}`
  );

  const response = await fetch(`/api/v2/users/${userLoggerId}.json`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${credentials_user}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    alert("Perfil atualizado com sucesso!");

    let menu_banner = document.querySelector("#banner");
    let menu_descricao = document.querySelector("#descricao");

    menu_descricao.innerHTML = descricao.replace(/\n/g, "<br>");

    menu_banner.className = "user-banner row-span-1";
    menu_banner.classList.add(...banner.split(" "));

    gsap.to(".modal-banner", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(".modal-content-all", {
      opacity: 0,
      scale: 0.7,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.4,
      onComplete: () => {
        document.getElementById("modal-editar-perfil").style.display = "none";
      },
    });

    // Atualiza os dados locais
    userMap[userLoggerId].user_fields.user_descricao = descricao;
    userMap[userLoggerId].user_fields.banner_user = banner;
    userMap[userLoggerId].user_fields.user_hobbies = selectedHobbies;

    renderMenuUser(userMap[userLoggerId]);
    document.body.style.overflow = "scroll";
  } else {
    alert("Erro ao salvar perfil.");
  }
}

const getCommunityTopics = async () => {
  const response = await fetch("/api/v2/community/topics", {
    headers: {},
  });

  if (!response.ok) {
    console.error("Erro ao buscar tópicos:", response.statusText);
    return [];
  }

  const data = await response.json();
  cachedTopics = data.topics || [];
  allTopics = cachedTopics;
  return cachedTopics;
};

function getTopicNameById(topicId) {
  const topic = cachedTopics.find((t) => t.id === topicId);
  return topic ? topic.name : "Tópico desconhecido";
}

function getUserNameById(authorId) {
  const author = allUsers.find((user) => user.id === authorId);
  return author ? author.name : "Colaborador";
}

const getPosts = async (topicId = null) => {
  const url =
    topicId && topicId !== "all"
      ? `/api/v2/community/topics/${topicId}/posts`
      : "/api/v2/community/posts";

  const response = await fetch(url, {
    headers: {},
  });

  if (!response.ok) {
    console.error("Erro ao buscar posts:", response.statusText);
    return [];
  }

  const data = await response.json();
  return data.posts || [];
};

const likeInProgress = {}; // postId: true/false

async function curtirPost(element) {
  const postId = element.getAttribute("data-post-id");

  // Tenta buscar os elementos no contexto local (element), no popup ou na home
  const span =
    element.querySelector(".quant-curtidas") ||
    document.querySelector(`.popup-postagem[data-post-id="${postId}"] .quant-curtidas`) ||
    document.querySelector(`.postagem[data-post-id="${postId}"] .quant-curtidas`);

  const heartIcon =
    element.querySelector("i.bi-suit-heart-fill") ||
    document.querySelector(`.popup-postagem[data-post-id="${postId}"] i.bi-suit-heart-fill`) ||
    document.querySelector(`.postagem[data-post-id="${postId}"] i.bi-suit-heart-fill`);

  const hexagonIcon =
    element.querySelector("i.bi-hexagon-fill") ||
    document.querySelector(`.popup-postagem[data-post-id="${postId}"] i.bi-hexagon-fill`) ||
    document.querySelector(`.postagem[data-post-id="${postId}"] i.bi-hexagon-fill`);


  if (likeInProgress[postId]) return;
  likeInProgress[postId] = true;

  const votosDoPost = mapVotes[postId] || [];
  const votoDoUsuario = votosDoPost.find((v) => v.user_id == userLoggerId);

  const email_user = userMap[userLoggerId].email;
  const credentials_user = btoa(`fabio.santos@bcrcx.com/token:${token}`);
  const iconsLike = element.querySelector(".iconsLike");

  //  ERRO  let span = element.querySelector(".quant-curtidas")
  //            || element.closest(".popup-actions")?.querySelector(".quant-curtidas")
  //            || document.querySelector(`.postagem[data-post-id="${postId}"] .quant-curtidas`);

  //   if (!span || !heartIcon || !hexagonIcon) {
  //     console.warn("Elemento esperado não encontrado pra curtir");
  //     return;
  //   }
  try {
    if (votoDoUsuario) {
      // Descurtir
      const voteId = votoDoUsuario.id;

      const response = await fetch(`/api/v2/help_center/votes/${voteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${credentials_user}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote: { user_id: userLoggerId } }),
      });

      if (response.ok) {
        span.textContent = Math.max(0, parseInt(span.textContent) - 1);
        heartIcon.classList.remove("curtido");
        hexagonIcon.classList.remove("hexagonLike");
        gsap.to(heartIcon, { color: "#fff", duration: 0.3 });

        mapVotes[postId] = votosDoPost.filter((v) => v.user_id != userLoggerId);
      }
    } else {
      // Curtir
      const response = await fetch(`/api/v2/community/posts/${postId}/up`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials_user}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote: { user_id: userLoggerId } }),
      });

      if (response.ok) {
        const result = await response.json();
        span.textContent = parseInt(span.textContent) + 1;
        heartIcon.classList.add("curtido");
        hexagonIcon.classList.add("hexagonLike");

        gsap.fromTo(
          heartIcon,
          { fontSize: "0.75rem", color: "#fff" },
          {
            fontSize: "1rem",
            duration: 0.2,
            color: "#86dbf6",
            ease: "power4.out",
            onComplete: () =>
              gsap.to(heartIcon, {
                scale: 1,
                duration: 0.1,
                fontSize: "0.75rem",
              }),
          }
        );

        if (!mapVotes[postId]) mapVotes[postId] = [];
        mapVotes[postId].push({
          user_id: userLoggerId,
          id: result.vote?.id || Date.now(),
        });
      }
    }
  } catch (error) {
    console.error("Erro ao curtir/descurtir post:", error);
  } finally {
    likeInProgress[postId] = false;
  }
}

// *---------------------------------*
// *---- 🕒 RENDERIZAR NA TELA -----*
// *---------------------------------*
function abrirModalFiltro() {
  document.getElementById("badgeFilterModal").classList.remove("hidden");
}

function fecharModalFiltro() {
  document.getElementById("badgeFilterModal").classList.add("hidden");
}

function contarUsuariosPorBadge(users) {
  const counts = {};

  users.forEach((user) => {
    (user.badges || []).forEach((badge) => {
      counts[badge.name] = (counts[badge.name] || 0) + 1;
    });
  });

  return counts;
}

function renderBadgeFilters(allBadges) {
  const selectEl = document.getElementById("badge-select");
  if (!selectEl) return;

  const badgeCounts = contarUsuariosPorBadge(allUsers);

  const badgeOptions = allBadges.map((badge) => ({
    name: badge.name,
    label: `${badge.name} (${badgeCounts[badge.name] || 0})`,
  }));

  selectEl.innerHTML = badgeOptions
    .map((b) => `<option value="${b.name}">${b.label}</option>`)
    .join("");

  new TomSelect("#badge-select", {
    plugins: ["remove_button"],
    maxItems: null,
    placeholder: "Selecione as medalhas...",
    persist: false,
    create: false,
  });
}

function aplicarFiltroBadges() {
  const selectedBadges = Array.from(
    document.querySelector("#badge-select").selectedOptions
  ).map((opt) => opt.value);
  const noBadgeChecked = document.getElementById("no-badge-filter").checked;

  filteredUsers = allUsers.filter((user) => {
    const userBadgeNames = user.badges?.map((b) => b.name) || [];

    if (noBadgeChecked) return userBadgeNames.length === 0;
    if (selectedBadges.length === 0) return true;

    // Verifica se o usuário tem TODAS as badges selecionadas
    return selectedBadges.every((badge) => userBadgeNames.includes(badge));
  });

  currentUserIndex = 0;
  animateUserRender();
  fecharModalFiltro();
}

const POST_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

const getPostsWithCache = async (topicId = null) => {
  const cacheKey =
    topicId && topicId !== "all"
      ? `cachedPosts_topic_${topicId}`
      : "cachedPosts_all";

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      const now = Date.now();

      if (parsed.timestamp && now - parsed.timestamp < POST_CACHE_TTL_MS) {
        return parsed.data;
      } else {
        localStorage.removeItem(cacheKey); // Cache expirado
      }
    } catch (err) {
      console.warn("Erro ao processar cache de posts:", err);
    }
  }

  // Fetch e salva novo cache
  const posts = await getPosts(topicId);
  const cachePayload = {
    timestamp: Date.now(),
    data: posts,
  };
  localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
  return posts;
};

async function renderMenuUser() {
  const menuUserEl = document.querySelector(".menu-user");
  if (!menuUserEl) return;
  const userId = menuUserEl.id;

  try {
    // Requisição do usuário
    const userResponse = await fetch(`/api/v2/users/${userId}`);
    const { user } = await userResponse.json();
    currentUser = { user };

    const email_user = user.email;
    const credentials_user = btoa(`${email_user}/token:${token}`);

    // Requisição das badges
    const badgeResponse = await fetch(
      `/api/v2/gather/badge_assignments?user_id=${user.id}`,
      {
        headers: {
          Authorization: `Basic ${credentials_user}`,
          "Content-Type": "application/json",
        },
      }
    );
    const badgeData = await badgeResponse.json();

    const allBadgeAssignments = badgeData.badge_assignments || [];

    const badgePreview = allBadgeAssignments.slice(0, 3);
    const extraBadges = allBadgeAssignments.length - badgePreview.length;

    const badgesInfo = await Promise.all(
      badgePreview.map(async (badgeAssignment) => {
        const badgeDetailsResponse = await fetch(
          `/api/v2/gather/badges/${badgeAssignment.badge_id}`,
          {
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
          }
        );

        const badgeDetailsData = await badgeDetailsResponse.json();
        return {
          name: badgeDetailsData.badge.name,
          iconUrl: badgeDetailsData.badge.icon_url,
          description: badgeDetailsData.badge.description,
        };
      })
    );

    // Salva badges e extras no objeto user manualmente
    user.badges = badgesInfo;
    user.extraBadges = extraBadges;

    // 3️⃣ Requisições adicionais
    const [postsRes, followersRes, followingsRes] = await Promise.all([
      fetch(`/api/v2/community/users/${user.id}/posts`, {
        headers: { Authorization: `Basic ${credentials}` },
      }),
      fetch(
        `/api/v2/help_center/users/${user.id}/user_subscriptions?type=followers`,
        {
          headers: { Authorization: `Basic ${credentials}` },
        }
      ),
      fetch(
        `/api/v2/help_center/users/${user.id}/user_subscriptions?type=followings`,
        {
          headers: { Authorization: `Basic ${credentials}` },
        }
      ),
    ]);

    if (!hobbiesCarregados) {
      try {
        const res = await fetch("/api/v2/user_fields/37130447328916");
        const data = await res.json();
        allHobbiesOptions = data.user_field.custom_field_options;
        hobbiesCarregados = true;
      } catch (err) {
        console.error("Erro ao carregar hobbies:", err);
      }
    }

    const hobbiesSelecionados = user.user_fields.user_hobbies || [];

    let hobbiesHTML = hobbiesSelecionados
      .map((hobbieValue) => {
        const hobbie = allHobbiesOptions.find(
          (opt) => opt.value === hobbieValue
        );
        return hobbie
          ? `<li class="list select-none flex items-center gap-1 bg-[var(--bg-hobbies)] shadow-md shadow-indigo-500/50">${hobbie.name}</li>`
          : "";
      })
      .join("");

    const postsData = await postsRes.json();
    const followersData = await followersRes.json();
    const followingsData = await followingsRes.json();

    const postCount = postsData.posts?.length || 0;
    const followerCount = followersData.user_subscriptions?.length || 0;
    const followingCount = followingsData.user_subscriptions?.length || 0;

    userLoggerId = userId;

    // Montagem do HTML
    const modalBanner = document.querySelector(".modal-banner");
    const iniciaisNome = capturarIniciais(user.name);
    const hasPhoto = user.photo && user.photo.mapped_content_url;

    const badgesHTML = montarBadgesHTML(user.badges, user.extraBadges);

    const html = `
    	<div id="search-menu-user" class="absolute backdrop-blur-[5px] bg-black/20 flex h-[60px] items-center justify-center rounded-b-xl row-span-1 shadow-indigo-950/25 shadow-xl w-full z-5">
        <button class="editar_perfil" onclick="abrirModalEditarPerfil(userMap[userLoggerId])"><i class="bi bi-pencil-square"></i></button>
        <input type="text" placeholder="Pesquisar usuários..." class="user-search-input rounded-md bg-[url(/hc/theming_assets/01JT9CP4K6HA41BV42EQV1Z66J)] px-3 py-1 max-w-md bg-white text-black placeholder-gray-500 focus:outline-none">
      </div>
    	<div id="banner" class="user-banner row-span-1 ${
        user.user_fields.banner_user ||
        "bg-gradient-to-tr from-neutral-500 to-neutral-800"
      }">
      	<div class="user-initials w-21 h-21 md:w-21 md:h-21 lg:w-21 lg:h-21 2xl:w-23 2xl:h-23 ${
          hasPhoto ? "hidden" : ""
        }">
                ${iniciaisNome}
        </div>
         <img class="user-avatar w-22 h-22 md:w-26 md:h-26 lg:w-25 lg:h-25 2xl:w-32 2xl:h-32 bottom-[-50px] absolute" src="${
           hasPhoto ? user.photo.mapped_content_url : ""
         }" alt="${user.name}" style="${hasPhoto ? "" : "display: none"};">
      </div>
      <div class="menu-bottom overflow-auto p-[1rem]">
            <div class="user-information-main">
            	 <div class="flex gap-4 items-center">
                 <h2> ${user.name} </h2>
                 <ul aria-label="Medalhas" class="community-badge-titles">
                    <li class="community-badge" title="" aria-label="">
                        ${badgesHTML}
                     </li>
                 </ul>
               </div>
               <div class="menu-user-infos select-none">
                 <div class="user-info user-posts">
                      <h3>Postagens</h3>
                    <p>${postCount}</p>
                  </div>
                 <div class="user-info user-followers">
                      <h3>Seguidores</h3>
                    <p>${followerCount}</p>
                  </div>
                 <div class="user-info user-following">
                    <h3>Seguindo</h3>
                    <p>${followingCount}</p>
                 </div>
            		</div>
             	</div>
              <div class="h-[1px] flex items-center justify-center w-[80%] my-5 mx-auto bg-[#00000020] rounded-xl">
                <a href="/hc/pt-br/profiles/${
                  user.id
                }" class="view-profile py-1 px-4 bg-[#1d5abc] rounded-[12px] text-white text-[.75rem] shadow-xl visited:text-white active:text-white">VIEW PROFILE</a>
              </div>
               <div class="menu-user-about">
                <div class="aboutMe">
                  <span>Sobre mim</span>
                 <p id="descricao" class="font-[cursive]">${
                   user.user_fields.user_descricao
                 }</p>
              </div>
                 <ul class="menu-user-hobbies">
            				${hobbiesHTML}
                 </ul>
               </div>
  </div>
    <div id="modal-user-externo" class="hidden absolute inset-0 bg-[#1e1e1e]/90 z-50 overflow-y-auto">
  <div class="menu-user-external bg-[#fff] w-full h-full relative overflow-hidden">
    <div id="menu-user-externo-conteudo" class="h-full bg-[var(--bg-hover-element)] text-[var(--text-base)]"></div>
  </div>
</div>
<div id="user-search-modal" class="hidden absolute inset-0 bg-[#1e1e1e]/90 z-50 overflow-y-auto">
  <div class="w-full h-full bg-[var(--bg-base)] rounded-xl p-4 relative">
    <button id="btn-fechar-busca" class="absolute top-6 right-3 text-[var(--text-base)] text-lg" title="Fechar">
      <i class="bi bi-x-lg"></i>
    </button>

    <!-- 🔍 Barra de pesquisa -->
    <input
      type="text"
      id="barra-pesquisa-user"
      placeholder="Pesquisar usuários..."
      class="w-[90%] px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <div id="search-results-container" class="space-y-2 overflow-auto" style="height: calc(100% - 77px);"></div>

    <div class="absolute bg-[var(--bg-comunidade-section)] left-[50%] p-3 text-center translate-x-[-50%] w-full rounded-t-xl">
      <button id="btn-carregar-mais" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded hidden">Carregar mais</button>
    </div>
  </div>
</div>
    `;

    menuUserEl.innerHTML = html;

    photo_user = `
    	<div class="user-initials w-22 h-22 md:w-26 md:h-26 lg:w-25 lg:h-25 2xl:w-32 2xl:h-32 border-solid border-6 border-gray-700 translate-y-15 ${
        hasPhoto ? "hidden" : ""
      }">
          ${iniciaisNome}
      </div>
      <img class="user-avatar translate-y-[3rem]" src="${
        hasPhoto ? user.photo.mapped_content_url : ""
      }" alt="${user.name}" style="${hasPhoto ? "" : "display: none"};">
    `;

    modalBanner.innerHTML = photo_user;
    atualizarDadosAutorPost();
    bindEventosBuscaUsuarios();
  } catch (error) {
    console.error("Erro ao carregar usuário ou badges:", error);
  }
}
renderMenuUser();

let currentPage = 0;
const pageSize = 20;
let loading = false;

let currentUserIndex = 0;
const usersPerLoad = 10;

function renderUsersIncrementally() {
  const container = document.getElementById("community-members");
  const sentinel = document.getElementById("user-loader-sentinel");

  if (!container || !sentinel) return;

  const usersToRender = filteredUsers.slice(
    currentUserIndex,
    currentUserIndex + usersPerLoad
  );

  usersToRender.forEach((user) => {
    const userNameAbreviado = abreviarNomeFormatado(user.name);
    const iniciaisNome = capturarIniciais(user.name);
    const hasPhoto = user.photo && user.photo.mapped_content_url;

    let badgesHTML = "";

    if (user.badges.length === 0) {
      badgesHTML = `<p class="no-badges">Não possui medalhas no momento</p>`;
    } else {
      user.badges.forEach((badge) => {
        badgesHTML += `
          <img src="${badge.iconUrl}" alt="${badge.name}" class="badge-icon w-[25px] rounded-full border border-[#00000070]">
        `;
      });

      if (user.extraBadges > 0) {
        badgesHTML += `<span class="badge-more text-sm text-gray-600 ml-1">+${user.extraBadges}</span>`;
      }
      console.log(user.extraBadges);
    }

    const div = document.createElement("div");
    div.className =
      "team-member backdrop-blur-[13px] bg-[var(--bg-team-member-card)]/20 border border-white/30 rounded-2xl pt-4 shadow-md";

    div.innerHTML = `
      <div class="avatar profile-avatar member-avatar">
        <div class="user-initials ${
          hasPhoto ? "hidden" : ""
        }">${iniciaisNome}</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" class="icon-agent">
          <path fill="currentColor" d="M6 0C2.7 0 0 2.7 0 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm2.3 7H3.7c-.3 0-.4-.3-.3-.5C3.9 7.6 4.9 7 6 7s2.1.6 2.6 1.5c.1.2 0 .5-.3.5z"/>
        </svg>
        <img class="user-avatar" src="${
          hasPhoto ? user.photo.mapped_content_url : ""
        }" alt="${user.name}" style="${hasPhoto ? "" : "display: none"};">
      </div>
      <span class="conteiner-name" title="${user.name}">
        <a class="user-name" href="/hc/pt-br/profiles/${
          user.id
        }">${userNameAbreviado}</a>
      </span>
      <div class="h-[1px] flex items-center justify-center w-[80%] my-5 mx-auto bg-[#00000020] rounded-xl">
      	<a href="/hc/pt-br/profiles/${
          user.id
        }" class="view-profile py-1 px-4 bg-[#1d5abc] rounded-[12px] text-white text-[.75rem] shadow-xl visited:text-white active:text-white">VIEW PROFILE</a>
      </div>
      <ul class="community-badge-titles">
        <li class="community-badge">${badgesHTML}</li>
      </ul>
    `;

    container.insertBefore(div, sentinel);
  });

  currentUserIndex += usersPerLoad;
}

function setupInfiniteScroll(allUsers) {
  const sentinel = document.getElementById("user-loader-sentinel");
  if (!sentinel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        renderUsersIncrementally(filteredUsers);
      }
    },
    {
      root: document.getElementById("community-members"),
      rootMargin: "0px",
      threshold: 1.0,
    }
  );

  observer.observe(sentinel);
}

//GUSTAVO
async function carregarComentarios(postId) {
  const comentariosContainer = document.querySelector(".coment-content");
  comentariosContainer.innerHTML = "<p>Carregando comentários...</p>";

  try {
    const response = await fetch(
      `/api/v2/community/posts/${postId}/comments.json`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    const post = allPosts.find((p) => p.id == postId);
    const author = userMap[post?.author_id];
    const authorName = author ? author.name : "Usuário";
    const hasPhoto = author?.photo?.mapped_content_url;
    const iniciaisNome = capturarIniciais(authorName);
    const descricaoPost = parseHTMLDetails(post.details).paragraphs[0] || ""; // primeira descrição

    const avatarHTML = `
      <div class="user-initials w-22 h-22 ${hasPhoto ? "hidden" : ""}">
        ${iniciaisNome}
      </div>
      <img class="user-avatar w-22 h-22" src="${
        hasPhoto ? hasPhoto : ""
      }" alt="${authorName}" style="${hasPhoto ? "" : "display: none"};">
    `;

    const descricaoHTML = `
      <div class="coment-content-2">
        <div class="comment-user">
          <div class="comment-profile">
            <div class="comments-img">
              ${avatarHTML}
            </div>
            <div class="flex flex-col">
              <div class="coment-content-up">
                <p class="text-[.8rem]">
                  <span class="mr-1 font-bold">${authorName}</span><span class="font-normal">${descricaoPost}</span>
                </p>
              </div>
              <div class="coment-text">
                <div class="coment-content-bot">
                  <span class="font-normal">${formatarData(
                    post.created_at
                  )}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const comentariosHTML =
      data.comments && data.comments.length > 0
        ? data.comments
            .map((comment) => {
              const commentAuthor = userMap[comment.author_id];
              const commentName = commentAuthor
                ? commentAuthor.name
                : "Usuário";
              const commentPhoto = commentAuthor?.photo?.mapped_content_url;
              const iniciais = capturarIniciais(commentName);
              const formattedDate = formatarData(comment.created_at);

              const avatarComentHTML = `
                <div class="user-initials w-22 h-22 ${
                  commentPhoto ? "hidden" : ""
                }">
                  ${iniciais}
                </div>
                <img class="user-avatar w-22 h-22" src="${
                  commentPhoto || ""
                }" alt="${commentName}" style="${
                commentPhoto ? "" : "display: none"
              };">
              `;

              return `
                <div class="coment-content-2">
                  <div class="comment-user flex justify-between">
                    <div class="comment-profile">
                      <div class="comments-img">
                        ${avatarComentHTML}
                      </div>
                      <div class="flex flex-col">
                        <div class="coment-content-up">
                          <p class="text-[.8rem]">
                            <p class="mr-1 font-bold">${commentName}</p><span class="font-normal">${comment.body}</span>
                          </p>
                        </div>
                        <div class="coment-text">
                          <div class="coment-content-bot">
                            <span class="font-normal">${formattedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="icons iconsLike relative flex items-center"> 
                      <i class="bi bi-hexagon cursor-pointer block text-[#949494e3] text-[1rem]"></i>
                      <i class="bi bi-suit-heart absolute text-[.45rem] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"></i>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")
        : `<p class="text-sm text-gray-500">Ainda não há comentários adicionais.</p>`;

    comentariosContainer.innerHTML = descricaoHTML + comentariosHTML;
  } catch (error) {
    comentariosContainer.innerHTML = "<p>Erro ao carregar comentários.</p>";
    console.error("Erro ao buscar comentários:", error);
  }
}

//GUSTAVO
const overlay = document.getElementById("popupOverlay");
const closeBtn = document.getElementById("closePopup");
const overlayImg = document.getElementById("popupImagemContainer");

let allPosts = []; // todos os posts carregados
let renderedPostCount = 0;
const POSTS_PER_LOAD = 5;

const renderPostsIncrementally = () => {
  const container = document.getElementById("postagens");
  if (!container) return;

  const postsToRender = filteredPosts.slice(
    renderedPostCount,
    renderedPostCount + POSTS_PER_LOAD
  );

  postsToRender.forEach((post, index) => {
    const idx = renderedPostCount + index; // índice absoluto
    const author = userMap[post.author_id];
    const authorName = author ? author.name : "Usuário desconhecido";
    const authorPhoto = author?.photo?.mapped_content_url || "";
    const { paragraphs, images } = parseHTMLDetails(post.details);
    const topicName = getTopicNameById(post.topic_id);
    const description = paragraphs.length ? paragraphs[0] : "";

    const votes = mapVotes[post.id] || [];
    const userVotou = votes.some(
      (vote) => String(vote.user_id) === String(userLoggerId)
    );
    const curtidaClass = userVotou ? "curtido" : "";
    const hexagonLike = userVotou ? "hexagonLike" : "";

    console.log(userVotou);

    const maxDescriptionLength = 400;
    const isLong = description.length > maxDescriptionLength;
    const shortDescription = isLong
      ? description.slice(0, maxDescriptionLength) + "..."
      : description;

    const carrosselHTML = images.length
      ? `
  <div class="carrossel relative w-full overflow-hidden">
    ${
      images.length > 1
        ? `<button class="carrossel-btn carrossel-button-left absolute left-2 top-1/2 z-10 hidden" onclick="moveSlide(-1, 'slide${idx}', this)">
            <img class="btn-left" src="https://conecta.bcrcx.com/hc/theming_assets/01JY768XNBSVZRS5WEN1FZTBEJ" />
          </button>
          <button class="carrossel-btn carrossel-button-right absolute right-2 top-1/2 z-10" onclick="moveSlide(1, 'slide${idx}', this)">
            <img class="btn-right" src="https://conecta.bcrcx.com/hc/theming_assets/01JY768WK29SCC8C4W7GG6BNRD" />
          </button>`
        : ""
    }
    <div class="carrossel-slide flex transition-transform duration-300 ease-in-out" id="slide${idx}" data-index="0">
      ${images
        .map(
          (src) =>
            `<img src="${src}" class="carrossel-img w-full object-cover flex-shrink-0" />`
        )
        .join("")}
    </div>
  </div>
  `
      : "";

    const postHTML = `
      <div id="${post.id}" data-post-id="${
      post.id
    }" class="postagem max-w-[630px] hover:bg-[var(--bg-hover-element)] transition duration-300 cursor-pointer">
        <div class="post-author">
          <div class="avatar post-avatar">
            ${
              authorPhoto
                ? `<img src="${authorPhoto}" alt="${authorName}" class="user-avatar" />`
                : `<div class="user-initials">${capturarIniciais(
                    authorName
                  )}</div>`
            }
          </div>
          <div class="post-info">
            <div class="post-info-top">
              <div class="flex flex-row gap-1 px-2">
                <span title="">
                  <a class="autor_${
                    post.author_id
                  } no_underline_a">${authorName}</a>
                </span>
                <span>•</span>
                <div class="meta-group meta-group-opposite">
                	<span class="meta-data">
                 		<time class="text-[var(--placeholder-text)]" datetime="${
                      post.created_at
                    }">${formatarData(post.created_at)}</time>
                	</span>
              	</div>
              </div>
              <div class="show-more" data-post-id="${post.id}">
                <i class="bi bi-three-dots"></i>
              </div>
            </div>
            <div class="post-info-bottom text-[var(--placeholder-text)]">
              <p>Tópico • <span>${topicName}</span></p>
            </div>
          </div>
        </div>
        <div class="post-description">
            <span id="desc-short-${post.id}" style="${
      isLong ? "" : "display:none"
    }">${shortDescription}</span>
            <span id="desc-full-${post.id}" style="${
      isLong ? "display:none" : ""
    }">${description}</span>
            ${
              isLong
                ? `<button class="ver-mais" onclick="toggleDescricao(${post.id})">Ver mais</button>`
                : ""
            }
         </div>

       ${carrosselHTML}

        <div class="user-actions">
          <div id="like-post-${
            post.id
          }" class="icon-curtidas" onclick="curtirPost(this)" data-post-id="${
      post.id
    }">
            <div class="icons iconsLike"> 
              <i class="bi bi-hexagon-fill ${hexagonLike}"></i>
              <i class="bi bi-suit-heart-fill ${curtidaClass}"></i>
            </div>
              <span class="quant-curtidas select-none">${post.vote_sum}</span>
          </div>
          <div class="icon-comentarios" id="openPopup" onclick="abrirPopUp(this)">
          	<div class="icons">
            	<i class="bi bi-chat"></i>
             </div>
          	<span class="quant-comentarios">${post.comment_count}</span>
          </div>
        </div>

        <div class="add-comment pb-2 flex border-b-[var(--border-base)] border-b-1">
          <textarea class="auto-resize w-[85%] min-h-[1.5rem] max-h-[86px] resize-none overflow-hidden" rows="1" placeholder="Adicione um comentário..."></textarea>
          <span class="bi bi-send" title="enviar" onclick="enviarComentarioFeed(this)">Post</span>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", postHTML);

    console.log("Post ID:", post.id);
    console.log("userLoggerId:", userLoggerId, typeof userLoggerId);
    console.log(
      "votes for this post:",
      votes.map((v) => ({ id: v.user_id, type: typeof v.user_id }))
    );

    //GUSTAVO
    // document.querySelectorAll(".bi-send").forEach((btn) => {
    //    btn.addEventListener("click", function () {
    //      enviarComentario(this); // aqui sim o `this` é o botão correto
    //    });
    //  });
    const openBtn = document.querySelector(".icon-comentarios");

    openBtn.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
    });
    const textarea = document.querySelector(".auto-resize");
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto"; // reseta antes de crescer
      textarea.style.height = textarea.scrollHeight + "px";
    });
  });
  renderedPostCount += postsToRender.length;
};

const postLoaderSentinel = document.getElementById("post-loader-sentinel");

const setupPostInfiniteScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const remaining = filteredPosts.length - renderedPostCount;
        if (remaining > 0) {
          renderPostsIncrementally();
        }
      }
    },
    {
      rootMargin: "100px",
    }
  );

  if (postLoaderSentinel) {
    observer.observe(postLoaderSentinel);
  }
};

//função de abrir os comentários

function abrirPopUp(element) {
  if (!element) return;

  const postElement = element.closest(".postagem");
  const postId = postElement?.getAttribute("data-post-id");
  if (!postId) {
    console.error("Post ID não encontrado ao abrir popup");
    return;
  }

  postIdAtivo = postId;

  // Mostra o overlay
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Carrega os comentários
  carregarComentarios(postId);

  // Busca os dados do post ativo
  const post = allPosts.find((p) => p.id == postId);
  if (post) {
    const author = userMap[post.author_id];
    if (author) {
      //perfil do autor do post
      const hasPhoto = author?.photo?.mapped_content_url;
      const iniciaisNome = capturarIniciais(author.name);
      const avatarHTML = `
  <div class="user-initials w-[41px] h-[41px] rounded-full bg-gray-300 flex items-center justify-center text-white font-bold ${
    hasPhoto ? "hidden" : ""
  }">
    ${iniciaisNome}
  </div>
  <img class="w-[41px] h-[41px] flex rounded-full ${
    hasPhoto ? "" : "hidden"
  }" src="${hasPhoto ? hasPhoto : ""}" alt="${author.name}" />
`;

      document.getElementById("popupAutor").innerHTML = `
  <div class="assunto-user flex items-center">
    ${avatarHTML}
    <span class="user-name-assunto">${author.name}</span>
  </div>
`;
    }

    const imagens = parseHTMLDetails(post.details).images;
    const imagemContainer = document.getElementById("popupImagemContainer");
    imagemContainer.innerHTML = ""; // limpa o container

    // Centralizar popup se não tiver imagem
    const popupComents = document.querySelector(".popup");

    if (imagens.length === 0) {
      overlay.classList.add("centralizado");
      popupComents.classList.add("centralizado");
    } else {
      overlay.classList.remove("centralizado");
      popupComents.classList.remove("centralizado");
    }

    // Uma imagem: mostra normal
    if (imagens.length === 1) {
      imagemContainer.innerHTML = `
    <img src="${imagens[0]}" alt="Imagem do post" class="w-auto bg-white max-h-[90vh] min-h-[500px] max-w-[90%] rounded-md">
  `;
    }

    // Carrossel se tiver mais de uma
    if (imagens.length > 1) {
      let indexAtual = 0;

      const atualizarCarrossel = () => {
        imagemContainer.querySelector(".carousel-img").src =
          imagens[indexAtual];
      };

      imagemContainer.innerHTML = `
    <div class="carousel relative flex items-center justify-center">
      <button class="carousel-btn left-0 absolute z-10" id="carouselPrev">&#10094;</button>
      <img src="${imagens[0]}" class="carousel-img w-auto max-h-[90vh] min-h-[500px] max-w-[90%] rounded-md" />
      <button class="carousel-btn right-0 absolute z-10" id="carouselNext">&#10095;</button>
    </div>
  `;

      document.getElementById("carouselPrev").addEventListener("click", () => {
        indexAtual = (indexAtual - 1 + imagens.length) % imagens.length;
        atualizarCarrossel();
      });

      document.getElementById("carouselNext").addEventListener("click", () => {
        indexAtual = (indexAtual + 1) % imagens.length;
        atualizarCarrossel();
      });
    }
    // ... já preencheu autor, descrição, imagem etc.

    const userVotou = (mapVotes[post.id] || []).some(
      (v) => v.user_id == userLoggerId
    );
    const curtidaClass = userVotou ? "curtido" : "";
    const hexagonClass = userVotou ? "hexagonLike" : "";
    const totalCurtidas = mapVotes[post.id]?.length || 0;

    console.log(curtidaClass);
    console.log(userVotou);

    document.getElementById("popupActions").innerHTML = `


  <div class="popup-actions user-actions flex items-center  justify-items-center gap-6 flex-col">
  <div class="flex flex-row w-[100%] border-[#cccccc] border-b-1 pb-2 pl-2">
    <div class="like-section icons iconsLike cursor-pointer flex justify-items-center" data-post-id="${post.id}" onclick="curtirPost(this)">
    <i class="bi bi-hexagon-fill text-xs ${hexagonClass}"></i>
      <i class="bi bi-suit-heart-fill text-lg ${curtidaClass}"></i>
     
    </div>
    <div class="comment-section cursor-pointer flex items-center gap-1 pl-[40px]" onclick="ativarTextareaComentario()">
      <i class="bi bi-chat text-lg"></i> 
    </div>
    </div>
  <div class="info-curtidas-popup flex pl-2 flex-row w-[100%]">
     <span class="quant-curtidas text-sm">${totalCurtidas} likes, </span>
      <span class="quant-comentarios flex text-sm pl-2">${post.comment_count} comentários</span>
    </div>
  </div>
`;
  }

  // Evento para fechar o popup
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      document.body.style.overflow = "scroll";
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target === overlayImg) {
      overlay.style.display = "none";
      document.body.style.overflow = "scroll";
    }
  });
}

const renderTopicSelect = (topics) => {
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const dropdownLabel = document.getElementById("dropdownLabel");

  if (!dropdownButton || !dropdownMenu || !dropdownLabel) return;

  dropdownMenu.innerHTML = "";

  const createOption = (id, name) => {
    const option = document.createElement("div");
    option.className = "p-3 hover:bg-[#bfc7f8] cursor-pointer transition-all";
    option.textContent = name;
    option.dataset.value = id;
    return option;
  };

  const defaultOption = createOption("all", "Todos os Posts");
  dropdownMenu.appendChild(defaultOption);

  topics.forEach((topic) => {
    const option = createOption(topic.id, topic.name);
    dropdownMenu.appendChild(option);
  });

  const toggleDropdown = () => {
    const isOpen = dropdownMenu.classList.contains("opacity-100");
    dropdownMenu.classList.toggle("opacity-100", !isOpen);
    dropdownMenu.classList.toggle("pointer-events-auto", !isOpen);
    dropdownMenu.classList.toggle("opacity-0", isOpen);
    dropdownMenu.classList.toggle("pointer-events-none", isOpen);
    dropdownButton.querySelector("i").classList.toggle("rotate-180", !isOpen);
  };

  dropdownButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  dropdownMenu.addEventListener("click", async (e) => {
    const option = e.target.closest("div");
    if (option) {
      const selectedValue = option.dataset.value;
      dropdownLabel.textContent = option.textContent;
      toggleDropdown();

      showLoading();

      try {
        allPosts = await getPostsWithCache(
          selectedValue === "all" ? null : selectedValue
        );
        filteredPosts = allPosts;

        mapVotes = {};
        for (const post of filteredPosts) {
          const votes = await getVotesForPost(post.id);
          mapVotes[post.id] = votes;
        }

        renderedPostCount = 0;
        document.getElementById("postagens").innerHTML = "";
        renderPostsIncrementally();
      } catch (err) {
        console.error("Erro ao filtrar posts:", err);
        alert("Erro ao filtrar posts, tente novamente.");
      } finally {
        hideLoading();
      }
    }
  });

  // Fecha dropdown ao clicar fora
  document.addEventListener("click", () => {
    dropdownMenu.classList.add("opacity-0", "pointer-events-none");
    dropdownMenu.classList.remove("opacity-100", "pointer-events-auto");
    dropdownButton.querySelector("i").classList.remove("rotate-180");
  });
};

// Pesquisar usuários dinamicamente
const filtrarUsuarios = (filtroNome) => {
  const checkboxes = document.querySelectorAll(".badge-filter:checked");
  const badgesSelecionadas = Array.from(checkboxes).map((cb) =>
    cb.value.toLowerCase()
  );

  filteredUsers = allUsers.filter((user) => {
    const nomeMatch = user.name.toLowerCase().includes(filtroNome);

    if (!nomeMatch) return false;

    if (badgesSelecionadas.length === 0) return true;

    const userBadges = user.badges.map((b) => b.name.toLowerCase());

    // Verifica se o usuário possui TODAS as badges selecionadas
    return badgesSelecionadas.every((badge) => userBadges.includes(badge));
  });

  currentUserIndex = 0;
  animateUserRender();
};

const debouncedSearch = debounce((filtro) => {
  filtrarUsuarios(filtro);
}, 200);

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const filtro = e.target.value.toLowerCase();
    debouncedSearch(filtro);
  });
}

// Também adicione um evento para os checkboxes
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("badge-filter")) {
    const filtro = searchInput.value.toLowerCase();
    filtrarUsuarios(filtro);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  showLoading();

  try {
    await loadAllBadges(); // já com cache
    allUsers = await getUsersWithCache(); // já com cache
    // renderUsers(allUsers);
    filteredUsers = allUsers;
    animateUserRender();
    renderUsersIncrementally();
    setupInfiniteScroll();

    renderBadgeFilters(allBadges);

    userMap = {};
    allUsers.forEach((user) => (userMap[user.id] = user));

    const topics = await getCommunityTopics();
    renderTopicSelect(topics);

    allPosts = await getPostsWithCache(); // com cache
    filteredPosts = allPosts;

    mapVotes = {};
    for (const post of allPosts) {
      const votes = await getVotesForPost(post.id);
      mapVotes[post.id] = votes;
    }

    renderedPostCount = 0;
    setTimeout(() => {
      renderPostsIncrementally(); // renderiza os primeiros
      setupPostInfiniteScroll(); // ativa scroll infinito
    }, 1000);
  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
    alert("Erro ao carregar conteúdo. Tente novamente.");
  } finally {
    hideLoading(); // ⬅️ Esconde overlay só no final
  }
});

// *---------------------------------*
// *--------- 👀 ANIMAÇÕES ---------*
// *---------------------------------*

const topicSelect = document.getElementById("customTopicSelect");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("barra-lateral");
const sidebarTexts = document.querySelectorAll(".sidebar-text");
const container_resize = document.querySelectorAll(".container-resize");
const barraSubmenu = document.getElementById("barra-submenu");
const menu_span_bcr = document.getElementById("menu-span-bcr");
const menu_span_e = document.getElementById("menu-span-e");
const menu_span_x = document.getElementById("menu-span-x");
const menu_img_logo = document.getElementById("menu-img-logo");

let isAnimating = false;

toggleSidebar.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;

  if (submenuAberto !== null) {
    // Fecha submenu e reabre a sidebar cheia
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.3 },
      onComplete: () => {
        barraSubmenu.classList.add("hidden");
        document.getElementById("submenu-content").innerHTML = "";
        submenuAberto = null;
        sidebarOpen = true;
        isAnimating = false;
      },
    });

    tl.to(sidebar, { width: "256px" })
      .to(container_resize, { duration: 0.5 })
      .add(() => {
        container_resize.forEach((el) => {
          el.classList.add("xl:ml-64");
          el.classList.remove("xl:ml-19");
        });
      }, "<")
      .from(menu_span_bcr, { fontWeight: 100, delay: 0.7 })
      .from(menu_span_e, { color: "black" })
      .from(menu_span_x, { rotate: 180 })
      .from(menu_img_logo, { scale: 0.5, opacity: 0 });

    sidebarTexts.forEach((el) => {
      const tlText = gsap.timeline();
      tlText
        .to(el, {
          delay: 0.3,
          onComplete: () => el.classList.remove("hidden"),
        })
        .fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            onComplete: () => el.classList.add("flex"),
          }
        );
    });

    gsap.to(barraSubmenu, {
      opacity: 0,
      x: 50,
      duration: 0.3,
    });
  } else {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.3 },
      onComplete: () => {
        sidebarOpen = !sidebarOpen;
        isAnimating = false;
      },
    });

    if (sidebarOpen) {
      // Fecha a sidebar
      tl.to(sidebar, { width: "76px" })
        .to(container_resize, { duration: 0.5 })
        .add(() => {
          container_resize.forEach((el) => {
            el.classList.add("xl:ml-19");
            el.classList.remove("xl:ml-64");
          });
        }, "<");

      sidebarTexts.forEach((el) => {
        gsap.to(el, {
          opacity: 0,
          x: -20,
          duration: 0.2,
          onComplete: () => {
            el.classList.add("hidden"), el.classList.remove("flex");
          },
        });
      });
    } else {
      // Abre a sidebar
      tl.to(sidebar, { width: "256px", duration: 0.5 })
        .to(container_resize, { duration: 0.5 })
        .add(() => {
          container_resize.forEach((el) => {
            el.classList.add("xl:ml-64");
            el.classList.remove("xl:ml-19");
          });
        }, "<")
        .from(menu_span_bcr, { fontWeight: 100, delay: 0.7 })
        .from(menu_span_e, { color: "black" })
        .from(menu_span_x, { rotate: 180 })
        .from(menu_img_logo, { scale: 0.5, opacity: 0 });

      sidebarTexts.forEach((el) => {
        const tlText = gsap.timeline();
        tlText
          .to(el, {
            delay: 0.3,
            onComplete: () => el.classList.remove("hidden"),
          })
          .fromTo(
            el,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.3,
              onComplete: () => el.classList.add("flex"),
            }
          );
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const barraLateral = document.getElementById("barra-lateral");
  const barraSubmenu = document.getElementById("barra-submenu");
  const submenuContent = document.getElementById("submenu-content");
  const sidebarTexts = document.querySelectorAll(".sidebar-text");

  function abrirSubmenu(ulElement) {
    // Só salva o estado da sidebar se nenhum submenu estiver aberto ainda
    if (submenuAberto === null) {
      sidebarEstavaAbertaAoAbrirSubmenu = sidebarOpen;
    }

    if (sidebarOpen) {
      gsap.to(barraLateral, {
        width: "76px",
        duration: 0.3,
        onStart: () => {
          sidebarTexts.forEach((el) => (el.style.display = "none"));
        },
      });
      sidebarOpen = false;
    } else {
      sidebarTexts.forEach((el) => (el.style.display = "none"));
    }

    barraSubmenu.classList.remove("hidden");
    gsap.fromTo(
      barraSubmenu,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.4, delay: 0.3 }
    );

    submenuContent.innerHTML = "";
    submenuContent.appendChild(ulElement);
  }

  function fecharSubmenu() {
    // Se a sidebar estava aberta antes de abrir o submenu, abre novamente
    if (sidebarEstavaAbertaAoAbrirSubmenu) {
      gsap.to(barraLateral, {
        width: "16rem",
        duration: 0.3,
        onComplete: () => {
          sidebarTexts.forEach((el) => (el.style.display = "flex"));
        },
      });
      sidebarOpen = true;
    } else {
      // Se já estava fechada, mantém fechada e garante que os textos continuam ocultos
      sidebarTexts.forEach((el) => (el.style.display = "none"));
    }

    gsap.to(barraSubmenu, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      onComplete: () => {
        barraSubmenu.classList.add("hidden");
        submenuContent.innerHTML = "";
        submenuAberto = null;
        sidebarEstavaAbertaAoAbrirSubmenu = null; // <-- aqui
      },
    });
  }
  async function criarListaEventos() {
    const ul = document.createElement("ul");
    ul.className = "flex flex-col gap-2";

    const sectionId = 37137115626260;
    const url = `/api/v2/help_center/sections/${sectionId}/articles.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
      const data = await response.json();

      // Limpa antes de popular
      ul.innerHTML = "";

      data.articles.forEach((article) => {
        const li = document.createElement("li");
        li.className =
          "side-list flex gap-3 items-center w-full p-2 hover:bg-gradient-to-l hover:from-[#699ceb] hover:to-[#718fff] rounded-[20px] cursor-pointer transition duration-300";

        li.innerHTML = `
        <i class="text-[1.7rem]/[40px] text-center w-[40px] h-[40px]">📅</i>
        <span class="sidebar-text">${article.title}</span>
      `;

        li.addEventListener("click", () => {
          fetch(`/api/v2/help_center/articles/${article.id}.json`)
            .then((resp) => resp.json())
            .then((json) => {
              const artigo = json.article;
              const htmlConteudo = `
              <h2 class="text-2xl font-bold mb-2">${artigo.title}</h2>
              <div class="text-base leading-relaxed">${artigo.body}</div>
            `;
              abrirPopupEventos(htmlConteudo);
            })
            .catch(console.error);
        });

        ul.appendChild(li);
      });

      return ul;
    } catch (error) {
      console.error(error);
      return ul;
    }
  }

  async function toggleSubmenu(tipo) {
    if (submenuAberto === tipo) {
      fecharSubmenu();
    } else {
      const ul =
        tipo === "solicitacoes"
          ? criarListaSolicitacoes()
          : await criarListaEventos(); // 👈 espera os dados carregarem

      if (submenuAberto !== null) {
        // Fecha o submenu atual antes de abrir outro
        gsap.to(barraSubmenu, {
          opacity: 0,
          x: -50,
          duration: 0.2,
          onComplete: () => {
            submenuContent.innerHTML = "";
            abrirSubmenu(ul);
            submenuAberto = tipo;
          },
        });
      } else {
        abrirSubmenu(ul);
        submenuAberto = tipo;
      }
    }
  }

  document.addEventListener("click", async (e) => {
    const autorEl = e.target.closest("[class*='autor_']");
    if (!autorEl) return;

    const classList = Array.from(autorEl.classList);
    const autorClass = classList.find((c) => c.startsWith("autor_"));
    if (!autorClass) return;

    const autorId = autorClass.replace("autor_", "");
    if (!autorId) return;

    await abrirMenuUsuarioExterno(autorId);
  });

  // Eventos de clique para abrir submenu de solicitações
  const botaoSolicitacoes = document.getElementById("toggle-solicitacoes");
  if (botaoSolicitacoes) {
    botaoSolicitacoes.addEventListener("click", () => {
      toggleSubmenu("solicitacoes");
    });
  }

  // Eventos de clique para abrir submenu de eventos
  const botaoEventos = document.getElementById("toggle-eventos");
  if (botaoEventos) {
    botaoEventos.addEventListener("click", () => {
      toggleSubmenu("eventos");
    });
  }

  // Clique em qualquer outro botão da barra lateral que não tenha submenu
  const botoesSemSubmenu = document.querySelectorAll(".botao-simples");
  botoesSemSubmenu.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (submenuAberto === "solicitacoes" || submenuAberto === "eventos") {
        fecharSubmenu();
        console.log(fecharSubmenu());
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const botoesMenu = document.querySelectorAll(".side-list, .botao-simples");

  const icones = {
    "menu-pesquisa": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYTDGE57ZFTMGHE43HBE9",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JW73NPN7VHP4HRMZTY7VXV5M",
      urlMatch: "/search",
    },
    "menu-home": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYP5K3Q487VQ5HRWAQHB7",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYQ6Q37H7V4FF2JGNRZ19",
      urlMatch: /^\/hc\/pt-br(\/)?(#main-content)?$/,
    },
    "toggle-solicitacoes": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYR5K9J8N52J06XJEXW6F",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYS3HXAFN1YF0B4CNZ8BS",
    },
    "menu-comunidade": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYJJV435GSK63QP9K83FM",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYM6ED08799KWT3YHKQ9X",
      urlMatch: /#container-community/,
    },
    "toggle-eventos": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JW4M0J3JCXTPYACKGTYHFA7S",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JW73NNTZ9YF0DBDHJ139318N",
    },
    "menu-minha-area": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01K1DQ8012FQKKYZBHA72FTAQQ",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01K1DQ7Z2J61YAWJWCB6AK4GA5",
      urlMatch: /\/hc\/pt-br\/categories\/\d+/,
    },
    "menu-perfil": {
      normal:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYVGCJTSYR060QZ2FRKN7",
      ativo:
        "https://conecta.bcrcx.com/hc/theming_assets/01JVYXYX03KHY03EK6KN22AV8M",
      urlMatch: /\/hc\/pt-br\/profiles\//,
    },
  };

  function resetarTodosOsIcones() {
    Object.keys(icones).forEach((id) => {
      const botao = document.getElementById(id);
      if (botao) {
        const img = botao.querySelector("img");
        if (img) {
          img.src = icones[id].normal;
        }
      }
    });
  }

  function aplicarIconeAtivoPorURL() {
    resetarTodosOsIcones();
    const fullPath = window.location.pathname + window.location.hash;
    let ativado = false;

    for (const [id, { ativo, urlMatch }] of Object.entries(icones)) {
      if (urlMatch && fullPath.match(urlMatch)) {
        const botao = document.getElementById(id);
        const img = botao?.querySelector("img");
        if (img) img.src = ativo;
        ativado = true;
        break;
      }
    }

    // Se nenhum match foi encontrado, ativa o ícone da home como fallback
    if (!ativado && window.location.pathname === "/hc/pt-br") {
      const img = document.querySelector("#menu-home img");
      if (img) img.src = icones["menu-home"].ativo;
    }
  }

  aplicarIconeAtivoPorURL();

  botoesMenu.forEach((botao) => {
    const id = botao.id;

    botao.addEventListener("click", () => {
      const img = botao.querySelector("img");

      // Se o botão for Home ou Comunidade, tratamos manualmente
      if (id === "menu-home" || id === "menu-comunidade") {
        resetarTodosOsIcones();
        if (img && icones[id]) img.src = icones[id].ativo;
        return;
      }

      // Submenus não possuem urlMatch, então seguem a lógica antiga
      if (!icones[id]?.urlMatch) {
        resetarTodosOsIcones();
        if (img) img.src = icones[id].ativo;
      }
    });
  });

  // Atualiza quando a hash muda (ex: comunidade)
  window.addEventListener("hashchange", aplicarIconeAtivoPorURL);
});

let renderTween = null;

function animateUserRender() {
  const container = document.getElementById("community-members");
  if (!container) return;

  // Cancela qualquer animação ativa
  if (renderTween) {
    gsap.killTweensOf(container);
  }

  renderTween = gsap.to(container, {
    duration: 0.2,
    autoAlpha: 0,
    onComplete: () => {
      const sentinel = document.getElementById("user-loader-sentinel");
      container.innerHTML = "";
      container.appendChild(sentinel);

      renderUsersIncrementally();

      gsap.to(container, {
        duration: 0.2,
        autoAlpha: 1,
      });

      // Eventos de hover
      setTimeout(() => {
        const membros = document.querySelectorAll(".team-member");

        membros.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            isHovering = true;
            stopAutoScroll();
          });

          item.addEventListener("mouseleave", () => {
            isHovering = false;
            if (!scrollManual) {
              startAutoScroll();
            }
          });
        });
      }, 0);
    },
  });
}

const container = document.getElementById("community-members");
const avatar = document.querySelector(".member-avatar");
const nome = document.querySelector(".conteiner-name");

let autoScrollTween;
let scrollManual = false;
let isHovering = false;
let scrollPauseTimeout;

// Scroll automático dos membros da equipe
function startAutoScroll() {
  if (!container) return; // Protege contra container inexistente

  // só rolar quando não estiver em hover ou rolando manualmente
  if (scrollManual || isHovering) return;

  autoScrollTween = gsap.to(container, {
    scrollLeft: "+=3",
    duration: 0.05,
    ease: "none",
    onComplete: () => {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1
      ) {
        container.scrollLeft = 0;
      }
      startAutoScroll();
    },
  });
}

// Parar a rolagem automática
function stopAutoScroll() {
  if (autoScrollTween) autoScrollTween.kill();
}

// Parar temporariamente após rolagem manual
function stopAutoScrollTemporarily() {
  scrollManual = true;
  stopAutoScroll();

  clearTimeout(scrollPauseTimeout);
  scrollPauseTimeout = setTimeout(() => {
    scrollManual = false;
    startAutoScroll();
  }, 400);
}

// Scroll manual com o mouse
if (container) {
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const newScroll = container.scrollLeft + e.deltaY;

    stopAutoScrollTemporarily();
    gsap.to(container, {
      scrollLeft: newScroll,
      duration: 0.4,
      ease: "power2.out",
    });
  });
}

startAutoScroll();

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(SplitText);
const split = new SplitText(".colaborador_name", { type: "words,chars" });

gsap.from(split.chars, {
  delay: 2,
  yPercent: "random([-30, 30])",
  rotation: "random(-30, 30)",
  color: "random([#dee0f9, #934e99, #ced600, #cb0a56])",
  ease: "back.out",
  autoAlpha: 0,
  repeat: -1,
  duration: 0.8,
  repeatDelay: 2.5,
  yoyo: true,
  stagger: {
    amount: 0.5,
  },
});

// *---------------------------------*
// *-------- 🕷 EVENT LISTENER -------*
// *---------------------------------*

const topicsBtn = document.getElementById("new_post_topics");
const dropdown = document.getElementById("topics_dropdown");
let selectedTopic = null;

if (topicsBtn) {
  topicsBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita fechar imediatamente ao abrir
    dropdown.classList.toggle("hidden");

    // Renderiza apenas uma vez
    if (!dropdown.classList.contains("rendered")) {
      dropdown.innerHTML = "";
      allTopics.forEach((topic) => {
        const option = document.createElement("div");
        option.className = "p-2 hover:bg-indigo-100 cursor-pointer text-sm";
        option.textContent = topic.name;
        option.dataset.topicId = topic.id;

        console.log(option.dataset.topicId);

        option.addEventListener("click", (e) => {
          e.stopPropagation();
          selectedTopic = topic;

          // Atualiza o texto visível no botão
          const span = topicsBtn.querySelector("span");
          if (span) span.textContent = topic.name;

          // Remove data-selected de todos e adiciona ao atual
          dropdown
            .querySelectorAll("[data-selected]")
            .forEach((el) => el.removeAttribute("data-selected"));
          option.setAttribute("data-selected", "true");
          option.setAttribute("data-topic-id", topic.id); // garantir que esteja presente

          dropdown.classList.add("hidden");
          console.log("Tópico selecionado:", topic);
        });

        dropdown.appendChild(option);
      });

      dropdown.classList.add("rendered");
    }
  });
}

// Fecha o dropdown ao clicar fora
document.addEventListener("click", (e) => {
  if (!topicsBtn.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

const new_post = document.getElementById("new_post_img");
if (new_post) {
  new_post.addEventListener("click", () => {
    document.getElementById("input_post_img").click();
  });
}

const input_post = document.getElementById("input_post_img");
if (input_post) {
  input_post.addEventListener("change", (e) => {
    const arquivos = Array.from(e.target.files);
    if (!arquivos.length) return;

    arquivos.forEach((imagem) => {
      if (!imagem.type.startsWith("image/")) return;

      selectedImages.push(imagem);

      const urlTemp = URL.createObjectURL(imagem);
      const imgContent = document.createElement("div");
      imgContent.classList.add(
        "min-w-[125px]",
        "h-[145px]",
        "max-w-[125px]",
        "rounded-[16px]",
        "object-cover",
        "relative"
      );

      const imgPreview = document.createElement("img");
      imgPreview.src = urlTemp;
      imgPreview.alt = imagem.name;
      imgPreview.classList.add(
        "min-w-[125px]",
        "h-[145px]",
        "max-w-[125px]",
        "rounded-[16px]",
        "object-cover"
      );

      const imgDelete = document.createElement("i");
      imgDelete.classList.add(
        "bi",
        "bi-x",
        "rounded-[50%]",
        "absolute",
        "top-2",
        "right-2",
        "bg-neutral-900",
        "text-white",
        "h-5",
        "w-5",
        "hover:bg-gray-800",
        "transition",
        "duration-300",
        "text-[1rem]/[1.4rem]",
        "cursor-pointer"
      );

      imgDelete.addEventListener("click", () => {
        const index = selectedImages.indexOf(imagem);
        if (index !== -1) selectedImages.splice(index, 1);
        previewContainer.removeChild(imgContent);
      });

      imgContent.appendChild(imgPreview);
      imgContent.appendChild(imgDelete);
      previewContainer.appendChild(imgContent);
    });
  });
}

const btn_postar = document.getElementById("btn_postar");
if (btn_postar) {
  document.getElementById("btn_postar").addEventListener("click", async () => {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth() + 1; // Adiciona 1 para mostrar o mês correto (1 a 12)
    const dia = agora.getDate();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const segundos = agora.getSeconds();
    const data_formatada = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    const titulo = `Publicação da comunidade - ${userLoggerId} - ${data_formatada}`;
    const descricao = document
      .getElementById("new_post_descricao")
      .value.trim();
    const topicElement = document.querySelector(
      "#topics_dropdown [data-selected]"
    );
    const topicId = topicElement?.dataset?.topicId;

    console.log(topicId);

    console.log(`${titulo}\n${descricao}\n${topicElement}`);

    if (!titulo || !descricao || !topicId) {
      alert("Preencha o título, descrição e selecione um tópico.");
      return;
    }

    try {
      let details = `<p>${descricao}</p>`;

      for (const imagem of selectedImages) {
        const resUpload = await fetch("/api/v2/guide/user_images/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            content_type: imagem.type,
            file_size: imagem.size,
          }),
        });

        if (!resUpload.ok) throw new Error("Erro ao criar URL de upload");

        const { upload } = await resUpload.json();
        const { url, headers } = upload;

        const putRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Disposition": headers["Content-Disposition"],
            "Content-Type": headers["Content-Type"],
            "X-Amz-Server-Side-Encryption":
              headers["X-Amz-Server-Side-Encryption"],
          },
          body: imagem,
        });

        if (!putRes.ok) throw new Error("Erro ao enviar imagem para o S3");

        const resImagePath = await fetch("/api/v2/guide/user_images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            token: upload.token,
            brand_id: "32957022264724",
          }),
        });

        if (!resImagePath.ok)
          throw new Error("Erro ao criar o caminho da imagem");

        const { user_image } = await resImagePath.json();
        const imgTag = `<figure class="image"><img style="aspect-ratio:auto;" src="${user_image.path}" width="${user_image.width}" height="${user_image.height}"></figure>`;
        details += imgTag;
      }

      const postBody = {
        post: {
          title: titulo,
          details,
          author_id: userLoggerId,
          topic_id: parseInt(topicId),
          notify_subscribers: false,
        },
      };

      const resPost = await fetch("/api/v2/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(postBody),
      });

      if (!resPost.ok) throw new Error("Erro ao criar o post");

      const newPost = await resPost.json();
      console.log("✅ Post criado:", newPost);

      // Limpar campos
      document.getElementById("new_post_descricao").value = "";
      previewContainer.innerHTML = "";
      selectedImages.length = 0;

      alert("Postagem realizada com sucesso!");
      location.reload();
    } catch (err) {
      console.error("❌ Erro ao postar:", err);
      alert("Erro ao postar. Verifique o console.");
    }
  });
}

// Exluir Artigo - Minha area
if (window.location.href.includes("categories/33378900597908")) {
  const articleUlArea = document.querySelector(".article-list");
  articleUlArea.style.display = "none";
}
if (window.location.href.includes("categories/33378900597908")) {
  const articleItemArea = document.querySelector(".article-list-item");
  articleItemArea.style.display = "none";
}
// Ordenar Artigos Promovidos
// const artigosPromovidos = document.querySelector('.promoted-articles')
// const items = Array.from(artigosPromovidos.children).reverse();
//   items.forEach(item => artigosPromovidos.appendChild(item));

// Título Categorias
if (window.location.href.includes("categories/33199638037780-DP")) {
  const titulodp = document.querySelector(".page-header h1");
  titulodp.innerHTML = "Departamento Pessoal";
}
if (window.location.href.includes("categories/33199690082068-RH")) {
  const titulorh = document.querySelector(".page-header h1");
  titulorh.innerHTML = "Recursos Humanos";
}
if (window.location.href.includes("categories/33199696071444-TI")) {
  const tituloti = document.querySelector(".page-header h1");
  tituloti.innerHTML = "Tecnologia da Informação";
}
if (window.location.href.includes("categories/33199660377876-BI")) {
  const titulobi = document.querySelector(".page-header h1");
  titulobi.innerHTML = "Business Intelligence";
}

// Barra de Pesquisa
// if (
//   window.location.href.includes(
//     "https://conecta.bcrcx.com/hc/pt-br/community/topics"
//   )
// ) {
//   const lupa = document.querySelector(".search-icon");
//   lupa.style.top = "53%";
// }
// if (
//   window.location.href.includes("https://conecta.bcrcx.com/hc/pt-br/categories")
// ) {
//   const lupa = document.querySelector(".search-icon");
//   lupa.style.top = "53%";
//   lupa.style.left = "78%";
// }
// if (
//   window.location.href.includes("https://conecta.bcrcx.com/hc/pt-br/sections")
// ) {
//   const lupa = document.querySelector(".search-icon");
//   lupa.style.top = "53%";
//   lupa.style.left = "78%";
// }
// if (
//   window.location.href.includes("https://conecta.bcrcx.com/hc/pt-br/search")
// ) {
//   const lupa = document.querySelector(".search-icon");
//   lupa.style.top = "53%";
//   lupa.style.left = "78%";
// }
// if (
//   window.location.href.includes("https://conecta.bcrcx.com/hc/pt-br/requests")
// ) {
//   const lupa = document.querySelector(".search-icon");
//   if (lupa) {
//     lupa.style.top = "53%";
//     lupa.style.left = "78%";
//   }
// }

// CATEGORIAS BCR
var assetsBcrOne =
  "https://conecta.bcrcx.com/hc/theming_assets/01JFG72FSFB6FWG588ES3ZRATJ";
var assetsBcrTwo =
  "https://conecta.bcrcx.com/hc/theming_assets/01JFG72FMBGG23CVQ98RB9XTT1";
var assetsBcrTree =
  "https://conecta.bcrcx.com/hc/theming_assets/01JFG72FPBWGKABHHDE30SM1QY";
var assetsBcrFour =
  "https://conecta.bcrcx.com/hc/theming_assets/01JFG72FVYCY9MVHJHH2KFM9GH";
var assetsMeuDepartamento =
  "https://conecta.bcrcx.com/hc/theming_assets/01K1DQ8012FQKKYZBHA72FTAQQ";

function scrollToComu() {
  const elemento = document.getElementById("comu");
  elemento.scrollIntoView({ behavior: "smooth" });
}

const categorias = {
  DP: assetsBcrOne,
  RH: assetsBcrTwo,
  TI: assetsBcrTree,
  "T&D": assetsBcrFour,
  "Minha Área": assetsMeuDepartamento,
};

document.addEventListener("DOMContentLoaded", () => {
  const categorias = {
    DP: assetsBcrOne,
    RH: assetsBcrTwo,
    TI: assetsBcrTree,
    "T&D": assetsBcrFour,
    "Minha Área": assetsMeuDepartamento,
  };

  // Mapeia sinônimos (siglas por idioma) para a chave original
  const siglasEquivalentes = {
    DP: "DP",
    "HR Admin": "DP",
    "Adm. RRHH": "DP",

    RH: "RH",
    "People & Culture": "RH",
    "Personas y Cultura": "RH",

    TI: "TI",
    IT: "TI",

    "T&D": "T&D",
    "L&D": "T&D",
    "D&C": "T&D",

    "Minha Área": "Minha Área",
    "My Area": "Minha Área",
    "Mi Área": "Minha Área",
  };

  const cards = document.querySelectorAll(".blocks-item[data-category]");
  cards.forEach((card) => {
    const categoriaBruta = card.getAttribute("data-category");
    const categoriaNormalizada = siglasEquivalentes[categoriaBruta];

    if (categoriaNormalizada && categorias[categoriaNormalizada]) {
      const imagem = categorias[categoriaNormalizada];
      card.querySelector("img").src = imagem;

      if (categoriaNormalizada === "TI") {
        card.classList.add(
          "suporte-tecnico-invertido",
          "col-span-1",
          "row-span-1",
          "justify-self-end"
        );
      }
      if (categoriaNormalizada === "DP") {
        card.classList.add(
          "departamento-pessoal-invertido",
          "col-span-1",
          "row-span-1",
          "justify-self-end",
          "self-end"
        );
      }
      if (categoriaNormalizada === "T&D") {
        card.classList.add(
          "business-intelligence-invertido",
          "col-span-1",
          "row-span-1"
        );
      }
      if (categoriaNormalizada === "RH") {
        card.classList.add(
          "recursos-humanos-invertido",
          "col-span-1",
          "row-span-1",
          "self-end"
        );
      }
      if (categoriaNormalizada === "Minha Área") {
        card.classList.add("meu-departamento-invertido", "hidden");
      }
    }
  });
});

(function () {
  "use strict";
  // Key map
  const ENTER = 13;
  const ESCAPE = 27;

  function toggleNavigation(toggle, menu) {
    const isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
    toggle.setAttribute("aria-expanded", !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute("aria-expanded", false);
    toggle.setAttribute("aria-expanded", false);
    toggle.focus();
  }

  // Navigation

  window.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".header .menu-button-mobile");
    const menuList = document.querySelector("#user-nav-mobile");

    if (!menuButton || !menuList) return;

    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNavigation(menuButton, menuList);
    });

    menuList.addEventListener("keyup", (event) => {
      if (event.keyCode === ESCAPE) {
        event.stopPropagation();
        closeNavigation(menuButton, menuList);
      }
    });

    // Toggles expanded aria to collapsible elements
    const collapsible = document.querySelectorAll(
      ".collapsible-nav, .collapsible-sidebar"
    );

    collapsible.forEach((element) => {
      const toggle = element.querySelector(
        ".collapsible-nav-toggle, .collapsible-sidebar-toggle"
      );

      element.addEventListener("click", () => {
        toggleNavigation(toggle, element);
      });

      element.addEventListener("keyup", (event) => {
        console.log("escape");
        if (event.keyCode === ESCAPE) {
          closeNavigation(toggle, element);
        }
      });
    });

    // If multibrand search has more than 5 help centers or categories collapse the list
    const multibrandFilterLists = document.querySelectorAll(
      ".multibrand-filter-list"
    );
    multibrandFilterLists.forEach((filter) => {
      if (filter.children.length > 6) {
        // Display the show more button
        const trigger = filter.querySelector(".see-all-filters");
        trigger.setAttribute("aria-hidden", false);

        // Add event handler for click
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          trigger.parentNode.removeChild(trigger);
          filter.classList.remove("multibrand-filter-list--collapsed");
        });
      }
    });
  });

  const isPrintableChar = (str) => {
    return str.length === 1 && str.match(/^\S$/);
  };

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end"),
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
    document.body.addEventListener(
      "click",
      this.outsideClickHandler.bind(this)
    );

    const toggleId = this.toggle.getAttribute("id") || crypto.randomUUID();
    const menuId = this.menu.getAttribute("id") || crypto.randomUUID();

    this.toggle.setAttribute("id", toggleId);
    this.menu.setAttribute("id", menuId);

    this.toggle.setAttribute("aria-controls", menuId);
    this.menu.setAttribute("aria-labelledby", toggleId);

    this.menu.setAttribute("tabindex", -1);
    this.menuItems.forEach((menuItem) => {
      menuItem.tabIndex = -1;
    });

    this.focusedIndex = -1;
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.toggle.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(
        this.menu.querySelectorAll("[role='menuitem'], [role='menuitemradio']")
      );
    },

    dismiss: function () {
      if (!this.isExpanded) return;

      this.toggle.removeAttribute("aria-expanded");
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
      this.focusedIndex = -1;
    },

    open: function () {
      if (this.isExpanded) return;

      this.toggle.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top");
      }
    },

    focusByIndex: function (index) {
      if (!this.menuItems.length) return;

      this.menuItems.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          item.tabIndex = 0;
          item.focus();
        } else {
          item.tabIndex = -1;
        }
      });

      this.focusedIndex = index;
    },

    focusFirstMenuItem: function () {
      this.focusByIndex(0);
    },

    focusLastMenuItem: function () {
      this.focusByIndex(this.menuItems.length - 1);
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const nextIndex = (currentIndex + 1) % this.menuItems.length;

      this.focusByIndex(nextIndex);
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      const currentIndex = this.menuItems.indexOf(currentItem);
      const previousIndex =
        currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.focusByIndex(previousIndex);
    },

    focusByChar: function (currentItem, char) {
      char = char.toLowerCase();

      const itemChars = this.menuItems.map((menuItem) =>
        menuItem.textContent.trim()[0].toLowerCase()
      );

      const startIndex =
        (this.menuItems.indexOf(currentItem) + 1) % this.menuItems.length;

      // look up starting from current index
      let index = itemChars.indexOf(char, startIndex);

      // if not found, start from start
      if (index === -1) {
        index = itemChars.indexOf(char, 0);
      }

      if (index > -1) {
        this.focusByIndex(index);
      }
    },

    outsideClickHandler: function (e) {
      if (
        this.isExpanded &&
        !this.toggle.contains(e.target) &&
        !e.composedPath().includes(this.menu)
      ) {
        this.dismiss();
        this.toggle.focus();
      }
    },

    clickHandler: function (event) {
      event.stopPropagation();
      event.preventDefault();

      if (this.isExpanded) {
        this.dismiss();
        this.toggle.focus();
      } else {
        this.open();
        this.focusFirstMenuItem();
      }
    },

    toggleKeyHandler: function (e) {
      const key = e.key;

      switch (key) {
        case "Enter":
        case " ":
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusFirstMenuItem();
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();

          this.open();
          this.focusLastMenuItem();
          break;
        }
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
      }
    },

    menuKeyHandler: function (e) {
      const key = e.key;
      const currentElement = this.menuItems[this.focusedIndex];

      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (key) {
        case "Esc":
        case "Escape": {
          e.stopPropagation();
          e.preventDefault();

          this.dismiss();
          this.toggle.focus();
          break;
        }
        case "ArrowDown":
        case "Down": {
          e.stopPropagation();
          e.preventDefault();

          this.focusNextMenuItem(currentElement);
          break;
        }
        case "ArrowUp":
        case "Up": {
          e.stopPropagation();
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        }
        case "Home":
        case "PageUp": {
          e.stopPropagation();
          e.preventDefault();
          this.focusFirstMenuItem();
          break;
        }
        case "End":
        case "PageDown": {
          e.stopPropagation();
          e.preventDefault();
          this.focusLastMenuItem();
          break;
        }
        case "Tab": {
          if (e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            this.dismiss();
            this.toggle.focus();
          } else {
            this.dismiss();
          }
          break;
        }
        default: {
          if (isPrintableChar(key)) {
            e.stopPropagation();
            e.preventDefault();
            this.focusByChar(currentElement, key);
          }
        }
      }
    },
  };

  // Drodowns

  window.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [];
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    dropdownToggles.forEach((toggle) => {
      const menu = toggle.nextElementSibling;
      if (menu && menu.classList.contains("dropdown-menu")) {
        dropdowns.push(new Dropdown(toggle, menu));
      }
    });
  });

  // Share

  window.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".share a");
    links.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(anchor.href, "", "height = 500, width = 500");
      });
    });
  });

  // Vanilla JS debounce function, by Josh W. Comeau:
  // https://www.joshwcomeau.com/snippets/javascript/debounce/
  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  // Define variables for search field
  let searchFormFilledClassName = "search-has-value";
  let searchFormSelector = "form[role='search']";

  // Clear the search input, and then return focus to it
  function clearSearchInput(event) {
    event.target
      .closest(searchFormSelector)
      .classList.remove(searchFormFilledClassName);

    let input;
    if (event.target.tagName === "INPUT") {
      input = event.target;
    } else if (event.target.tagName === "BUTTON") {
      input = event.target.previousElementSibling;
    } else {
      input = event.target.closest("button").previousElementSibling;
    }
    input.value = "";
    input.focus();
  }

  // Have the search input and clear button respond
  // when someone presses the escape key, per:
  // https://twitter.com/adambsilver/status/1152452833234554880
  function clearSearchInputOnKeypress(event) {
    const searchInputDeleteKeys = ["Delete", "Escape"];
    if (searchInputDeleteKeys.includes(event.key)) {
      clearSearchInput(event);
    }
  }

  // Create an HTML button that all users -- especially keyboard users --
  // can interact with, to clear the search input.
  // To learn more about this, see:
  // https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
  // https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
  function buildClearSearchButton(inputId) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("aria-controls", inputId);
    button.classList.add("clear-button");
    const buttonLabel = window.searchClearButtonLabelLocalized;
    const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
    button.innerHTML = icon;
    button.addEventListener("click", clearSearchInput);
    button.addEventListener("keyup", clearSearchInputOnKeypress);
    return button;
  }

  // Append the clear button to the search form
  function appendClearSearchButton(input, form) {
    const searchClearButton = buildClearSearchButton(input.id);
    form.append(searchClearButton);
    if (input.value.length > 0) {
      form.classList.add(searchFormFilledClassName);
    }
  }

  // Add a class to the search form when the input has a value;
  // Remove that class from the search form when the input doesn't have a value.
  // Do this on a delay, rather than on every keystroke.
  const toggleClearSearchButtonAvailability = debounce((event) => {
    const form = event.target.closest(searchFormSelector);
    form.classList.toggle(
      searchFormFilledClassName,
      event.target.value.length > 0
    );
  }, 200);

  // Search

  window.addEventListener("DOMContentLoaded", () => {
    // Set up clear functionality for the search field
    const searchForms = [...document.querySelectorAll(searchFormSelector)];
    const searchInputs = searchForms.map((form) =>
      form.querySelector("input[type='search']")
    );
    searchInputs.forEach((input) => {
      appendClearSearchButton(input, input.closest(searchFormSelector));
      input.addEventListener("keyup", clearSearchInputOnKeypress);
      input.addEventListener("keyup", toggleClearSearchButtonAvailability);
    });
  });

  const key = "returnFocusTo";

  function saveFocus() {
    const activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem(key, "#" + activeElementId);
  }

  function returnFocus() {
    const returnFocusTo = sessionStorage.getItem(key);
    if (returnFocusTo) {
      sessionStorage.removeItem("returnFocusTo");
      const returnFocusToEl = document.querySelector(returnFocusTo);
      returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }
  }

  // Forms

  window.addEventListener("DOMContentLoaded", () => {
    // In some cases we should preserve focus after page reload
    returnFocus();

    // show form controls when the textarea receives focus or back button is used and value exists
    const commentContainerTextarea = document.querySelector(
      ".comment-container textarea"
    );
    const commentContainerFormControls = document.querySelector(
      ".comment-form-controls, .comment-ccs"
    );

    if (commentContainerTextarea) {
      commentContainerTextarea.addEventListener(
        "focus",
        function focusCommentContainerTextarea() {
          commentContainerFormControls.style.display = "block";
          commentContainerTextarea.removeEventListener(
            "focus",
            focusCommentContainerTextarea
          );
        }
      );

      if (commentContainerTextarea.value !== "") {
        commentContainerFormControls.style.display = "block";
      }
    }

    // Expand Request comment form when Add to conversation is clicked
    const showRequestCommentContainerTrigger = document.querySelector(
      ".request-container .comment-container .comment-show-container"
    );
    const requestCommentFields = document.querySelectorAll(
      ".request-container .comment-container .comment-fields"
    );
    const requestCommentSubmit = document.querySelector(
      ".request-container .comment-container .request-submit-comment"
    );

    if (showRequestCommentContainerTrigger) {
      showRequestCommentContainerTrigger.addEventListener("click", () => {
        showRequestCommentContainerTrigger.style.display = "none";
        Array.prototype.forEach.call(requestCommentFields, (element) => {
          element.style.display = "block";
        });
        requestCommentSubmit.style.display = "inline-block";

        if (commentContainerTextarea) {
          commentContainerTextarea.focus();
        }
      });
    }

    // Mark as solved button
    const requestMarkAsSolvedButton = document.querySelector(
      ".request-container .mark-as-solved:not([data-disabled])"
    );
    const requestMarkAsSolvedCheckbox = document.querySelector(
      ".request-container .comment-container input[type=checkbox]"
    );
    const requestCommentSubmitButton = document.querySelector(
      ".request-container .comment-container input[type=submit]"
    );

    if (requestMarkAsSolvedButton) {
      requestMarkAsSolvedButton.addEventListener("click", () => {
        requestMarkAsSolvedCheckbox.setAttribute("checked", true);
        requestCommentSubmitButton.disabled = true;
        requestMarkAsSolvedButton.setAttribute("data-disabled", true);
        requestMarkAsSolvedButton.form.submit();
      });
    }

    // Change Mark as solved text according to whether comment is filled
    const requestCommentTextarea = document.querySelector(
      ".request-container .comment-container textarea"
    );

    const usesWysiwyg =
      requestCommentTextarea &&
      requestCommentTextarea.dataset.helper === "wysiwyg";

    function isEmptyPlaintext(s) {
      return s.trim() === "";
    }

    function isEmptyHtml(xml) {
      const doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
      const img = doc.querySelector("img");
      return img === null && isEmptyPlaintext(doc.children[0].textContent);
    }

    const isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

    if (requestCommentTextarea) {
      requestCommentTextarea.addEventListener("input", () => {
        if (isEmpty(requestCommentTextarea.value)) {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute("data-solve-translation");
          }
        } else {
          if (requestMarkAsSolvedButton) {
            requestMarkAsSolvedButton.innerText =
              requestMarkAsSolvedButton.getAttribute(
                "data-solve-and-submit-translation"
              );
          }
        }
      });
    }

    const selects = document.querySelectorAll(
      "#request-status-select, #request-organization-select"
    );

    selects.forEach((element) => {
      element.addEventListener("change", (event) => {
        event.stopPropagation();
        saveFocus();
        element.form.submit();
      });
    });

    // Submit requests filter form on search in the request list page
    const quickSearch = document.querySelector("#quick-search");
    if (quickSearch) {
      quickSearch.addEventListener("keyup", (event) => {
        if (event.keyCode === ENTER) {
          event.stopPropagation();
          saveFocus();
          quickSearch.form.submit();
        }
      });
    }

    // Submit organization form in the request page
    const requestOrganisationSelect = document.querySelector(
      "#request-organization select"
    );

    if (requestOrganisationSelect) {
      requestOrganisationSelect.addEventListener("change", () => {
        requestOrganisationSelect.form.submit();
      });

      requestOrganisationSelect.addEventListener("click", (e) => {
        // Prevents Ticket details collapsible-sidebar to close on mobile
        e.stopPropagation();
      });
    }

    // If there are any error notifications below an input field, focus that field
    const notificationElm = document.querySelector(".notification-error");
    if (
      notificationElm &&
      notificationElm.previousElementSibling &&
      typeof notificationElm.previousElementSibling.focus === "function"
    ) {
      notificationElm.previousElementSibling.focus();
    }
  });
})();
//GUSTAVO const sectionId = 37137115626260;const url = `/api/v2/help_center/sections/${sectionId}/articles.json`;
// document.addEventListener('DOMContentLoaded', () => {
//   fetch(url)
//     .then(response => {
//       if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
//       return response.json();
//     })
//     .then(data => {
//       // data.articles é um array dos artigos da seção
//     const container = document.querySelector('.eventos-lista-content');
//       data.articles.forEach(article => {
//         // Criar botão para cada artigo
//         const btn = document.createElement('button');
//         btn.textContent = article.title;  // título como texto puro
//         btn.dataset.id = article.id;
//         container.appendChild(btn);

//         // Ao clicar no botão, buscar e exibir o conteúdo completo do artigo
//         btn.addEventListener('click', () => {
//           fetch(`/api/v2/help_center/articles/${article.id}.json`)
//             .then(resp => {
//               if (!resp.ok) throw new Error(`Erro na API: ${resp.status}`);
//               return resp.json();
//             })
//             .then(json => {
//               const artigo = json.article;
//               const contentDiv = document.querySelector('.eventos');
//               contentDiv.innerHTML = ''; // limpa conteúdo anterior// Título como <h2> usando textContent para evitar XSS
//             const h2 = document.createElement('h2');
//               h2.textContent = artigo.title;
//               contentDiv.appendChild(h2);
//               // Corpo do artigo (HTML simples) inserido de forma segura
//             const bodyDiv = document.createElement('div');
//               bodyDiv.innerHTML = artigo.body;
//               contentDiv.appendChild(bodyDiv);
//             })
//             .catch(console.error);
//         });
//       });
//     })
//     .catch(console.error);
// });

// ERRO const textarea = document.getElementById("autoGrowTextarea");

// textarea.addEventListener("input", function () {
//   this.style.height = "auto"; // redefine a altura
//   this.style.height = this.scrollHeight + "px"; // define para altura do conteúdo
// });

function ativarTextareaComentario() {
  const textarea = document.querySelector('.pptxt');
  if (textarea) {
    textarea.focus();
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
document.getElementById("toggle-eventos").addEventListener("click", () => {
  document.getElementById("barra-submenu").classList.remove("hidden");
  carregarEventosSidebar();
});

function abrirPopupEventos(htmlConteudo) {
  const overlay = document.getElementById("popup-eventos-overlay");
  const conteudo = document.getElementById("popup-eventos-conteudo");

  conteudo.innerHTML = htmlConteudo;
  overlay.classList.add("ativo");
  overlay.classList.remove("hidden");
  document.body.style.overflowY = "hidden";
}

function fecharPopupEventos() {
  const overlay = document.getElementById("popup-eventos-overlay");
  overlay.classList.remove("ativo");
  overlay.classList.add("hidden");
  document.body.style.overflowY = "scroll";
}

document
  .getElementById("fechar-popup-eventos")
  .addEventListener("click", fecharPopupEventos);
document
  .getElementById("popup-eventos-overlay")
  .addEventListener("click", (e) => {
    if (e.target.id === "popup-eventos-overlay") {
      fecharPopupEventos();
    }
  });

