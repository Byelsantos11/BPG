const tabelaHistorico = document.getElementById("tabela-historico");
const btnSair = document.getElementById("sair");

async function carregarHistorico() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  tabelaHistorico.innerHTML = `<tr><td colspan="4">Carregando histórico...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/historico/listar", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tabelaHistorico.innerHTML = `<tr><td colspan="4">Erro ao carregar histórico</td></tr>`;
      return;
    }

    const data = await res.json();

    if (!data.historico || data.historico.length === 0) {
      tabelaHistorico.innerHTML = `<tr><td colspan="4">Nenhum atendimento registrado.</td></tr>`;
      return;
    }

    tabelaHistorico.innerHTML = "";

    data.historico.forEach(item => {
      tabelaHistorico.innerHTML += `
        <tr>
          <td>${item.cliente}</td>
          <td>${item.servico}</td>
          <td>${item.status}</td>
          <td>${new Date(item.data).toLocaleDateString('pt-BR')}</td>
        </tr>
      `;
    });

  } catch (err) {
    tabelaHistorico.innerHTML = `<tr><td colspan="4">Erro ao carregar histórico</td></tr>`;
    console.error(err);
  }
}

btnSair.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
});

carregarHistorico();
