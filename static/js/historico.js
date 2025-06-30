const tabelaHistorico = document.getElementById("tabela-historico");
const sair = document.getElementById("sair");
const pesquisa = document.getElementById("pesquisa-servico");

let historicoCompleto = []; // Aqui guardaremos o histórico completo

// Botão sair
sair.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
});

// Listener da barra de pesquisa
pesquisa.addEventListener("input", () => {
  const termo = pesquisa.value.trim().toLowerCase();

  if (!termo) {
    // Se campo vazio, mostra o histórico completo filtrado por status
    const filtradoStatus = historicoCompleto.filter(item => {
      const status = item.status_servico?.toLowerCase();
      return status === "concluído" || status === "cancelado";
    });
    popularTabelaHistorico(filtradoStatus);
    return;
  }

  // Filtra pelo termo digitado
  const filtrados = historicoCompleto.filter(item => {
    const status = item.status_servico?.toLowerCase();
    if (status !== "concluído" && status !== "cancelado") return false;

    const nomeCliente = item.cliente?.nome?.toLowerCase() || "";
    const dispositivo = item.dispositivo?.toLowerCase() || "";
    const numeroSerie = item.numero_serie?.toLowerCase() || "";
    const tecnico = item.tecnico?.toLowerCase() || "";

    return (
      nomeCliente.includes(termo) ||
      dispositivo.includes(termo) ||
      numeroSerie.includes(termo) ||
      tecnico.includes(termo) ||
      status.includes(termo)
    );
  });

  popularTabelaHistorico(filtrados);
});

// Função para popular a tabela
function popularTabelaHistorico(lista) {
  if (!lista || lista.length === 0) {
    tabelaHistorico.innerHTML = `<tr><td colspan="7">Nenhum resultado encontrado.</td></tr>`;
    return;
  }

  tabelaHistorico.innerHTML = "";

  lista.forEach(item => {
    const dataRaw = item.data_criacao || item.createdAt || item.dataCriacao;
    const dataFormatada = dataRaw
      ? new Date(dataRaw.replace(" ", "T")).toLocaleDateString("pt-BR")
      : "-";

    tabelaHistorico.innerHTML += `
      <tr>
        <td>${item.cliente?.nome || "Desconhecido"}</td>
        <td>${item.dispositivo || "-"}</td>
        <td>${item.numero_serie || "-"}</td>
        <td>${item.descricao_problema || "-"}</td>
        <td>${item.tecnico || "-"}</td>
        <td>${item.status_servico || "-"}</td>
        <td>${dataFormatada}</td>
      </tr>
    `;
  });
}

// Carregar histórico de serviços concluídos ou cancelados
async function carregarHistorico() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  tabelaHistorico.innerHTML = `<tr><td colspan="7">Carregando histórico...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/servicos/listarServico", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tabelaHistorico.innerHTML = `<tr><td colspan="7">Erro ao carregar histórico</td></tr>`;
      return;
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      tabelaHistorico.innerHTML = `<tr><td colspan="7">Nenhum atendimento registrado.</td></tr>`;
      return;
    }

    // Filtro: apenas "Concluído" ou "Cancelado"
    historicoCompleto = data.filter(item => {
      const status = item.status_servico?.toLowerCase();
      return status === "concluído" || status === "cancelado";
    });

    popularTabelaHistorico(historicoCompleto);

  } catch (err) {
    tabelaHistorico.innerHTML = `<tr><td colspan="7">Erro ao carregar histórico</td></tr>`;
    console.error(err);
  }
}

// Chamada inicial
carregarHistorico();
