document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  function activateTab(button) {
    const targetId = button.getAttribute("data-target");

    // Atualiza botões
    buttons.forEach((btn) => {
      const inactiveColor = btn.getAttribute("data-inactive-bg");
      btn.classList.remove("active");
      btn.style.backgroundColor = inactiveColor;
      btn.style.color = "black";
    });

    // Define ativo
    const activeColor = button.getAttribute("data-active-bg");
    button.classList.add("active");
    button.style.backgroundColor = activeColor;
    button.style.color = "white";

    // Mostra conteúdo
    contents.forEach((content) => {
      content.classList.toggle("hidden", content.id !== targetId);
    });
  }

  // Evento clique
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn));
  });

  // Ativar primeiro tab ao carregar
  activateTab(document.querySelector(".tab-btn"));
});
