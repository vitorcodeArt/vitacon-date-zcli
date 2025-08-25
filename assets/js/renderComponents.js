async function loadPage(page) {
  try {
    const res = await fetch(`${page}.html`);
    if (!res.ok) throw new Error(`Erro ao carregar ${page}.html`);

    const html = await res.text();
    document.getElementById("root").innerHTML = html;
  } catch (err) {
    document.getElementById("root").innerHTML = `<p>Erro: ${err.message}</p>`;
  }
}

// Carregar tela inicial
document.addEventListener("DOMContentLoaded", () => {
  loadPage("app"); 
});