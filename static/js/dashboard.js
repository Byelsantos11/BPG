const sair = document.getElementById("sair");

sair.addEventListener("click", () => {
  sair.textContent = "Saindo...";
  localStorage.removeItem('token');
  setTimeout(() => {
    window.location.href = "./Login.html";
  }, 1000);
});

// Função para pegar o token armazenado
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login novamente.");
    window.location.href = "./Login.html";
    return null;
  }
  return token;
}

// Atualizar a contagem de clientes
async function atualizarClientes() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/clientes/quantidadeCliente", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar clientes");
    const data = await res.json();
    document.getElementById("clientes").textContent = data.quantidade || 0;
  } catch (err) {
    console.error(err);
    document.getElementById("clientes").textContent = "Erro";
  }
}

// Atualizar a contagem de produtos
async function atualizarProdutos() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/produtos/quantidadeProduto", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    const data = await res.json();
    document.getElementById("produtos").textContent = data.quantidade || 0;
  } catch (err) {
    console.error(err);
    document.getElementById("produtos").textContent = "Erro";
  }
}

// Atualizar serviços ativos
async function atualizarServicos() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/servicos/ativos", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar serviços ativos");
    const data = await res.json();
    document.getElementById("servicos").textContent = data.total || 0;
  } catch (err) {
    console.error(err);
    document.getElementById("servicos").textContent = "Erro";
  }
}

// Atualizar garantias ativas
async function atualizarGarantias() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/garantias/ativas", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar garantias ativas");
    const data = await res.json();
    document.getElementById("garantias").textContent = data.total || 0;
  } catch (err) {
    console.error(err);
    document.getElementById("garantias").textContent = "Erro";
  }
}

// Carregar serviços recentes e mostrar na tabela
async function carregarServicosRecentes() {
  const token = getToken();
  if (!token) return;

  const tabela = document.getElementById("tabela-servicos");
  tabela.innerHTML = `<tr><td colspan="4">Carregando...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/servicos/recentes", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao buscar serviços recentes");

    const data = await res.json();

    if (!data.servicos || data.servicos.length === 0) {
      tabela.innerHTML = `<tr><td colspan="4">Nenhum serviço recente encontrado.</td></tr>`;
      return;
    }

    tabela.innerHTML = "";

    data.servicos.forEach(servico => {
      // Você pode ajustar os nomes conforme sua API:
      const statusClasses = {
        "andamento": "andamento",
        "peças": "pecas",
        "concluído": "concluido",
        "diagnóstico": "diagnostico",
      };

      const statusLower = servico.status.toLowerCase();
      const statusClass = statusClasses[statusLower] || "andamento";

      tabela.innerHTML += `
        <tr>
          <td>${servico.cliente}</td>
          <td>${servico.dispositivo}</td>
          <td><span class="status ${statusClass}">${servico.status}</span></td>
          <td>${new Date(servico.data).toLocaleDateString('pt-BR')}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    tabela.innerHTML = `<tr><td colspan="4">Erro ao carregar serviços recentes.</td></tr>`;
  }
}

// Inicialização
function inicializarDashboard() {
  atualizarClientes();
  atualizarProdutos();
  atualizarServicos();
  atualizarGarantias();
  carregarServicosRecentes();
}

window.onload = inicializarDashboard;
