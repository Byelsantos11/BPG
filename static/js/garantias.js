const tabelaGarantias = document.getElementById("tabela-garantias");

// Variáveis formulário nova garantia
const btnNovaGarantia = document.getElementById("btn-novo-garantia");
const formGarantia = document.getElementById("form-garantia");
const cancelar = document.getElementById("cancelar-garantia");
const form = document.getElementById("garantia-form");
const selectClientes = document.getElementById("user_id");
const selectProdutos = document.getElementById("produto_id");

let garantiasCarregadas = [];

// Mostrar formulário nova garantia
btnNovaGarantia.addEventListener("click", () => {
  formGarantia.classList.remove("oculto");
  form.reset();
  document.getElementById("garantia_id").value = "";  // limpar id ao criar novo
});

// Cancelar formulário nova garantia
cancelar.addEventListener("click", () => {
  formGarantia.classList.add("oculto");
  form.reset();
  document.getElementById("garantia_id").value = ""; // limpar id ao cancelar
});

// Carregar clientes para select
async function carregarClientes() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/clientes/listaCliente", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      console.error("Erro ao carregar clientes");
      return;
    }
    const data = await res.json();
    selectClientes.innerHTML = `<option value="" disabled selected>Selecione o cliente</option>`;
    data.clientes.forEach(cliente => {
      const option = document.createElement("option");
      option.value = cliente.id;
      option.textContent = cliente.nome;
      selectClientes.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
  }
}

// Carregar produtos para select
async function carregarProdutos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/produtos/listaProduto", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      console.error("Erro ao carregar produtos");
      return;
    }
    const data = await res.json();
    selectProdutos.innerHTML = `<option value="" disabled selected>Selecione o produto</option>`;
    data.produtos.forEach(produto => {
      const option = document.createElement("option");
      option.value = produto.id;
      option.textContent = produto.nome;
      selectProdutos.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// Enviar dados do formulário (criar ou editar garantia)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  const garantiaId = document.getElementById("garantia_id").value.trim();

  const garantiaData = {
    user_id: document.getElementById("user_id").value,
    produto_id: document.getElementById("produto_id").value,
    pacote_garantia: document.getElementById("pacote_garantia").value,
    status_garantia: document.getElementById("status_garantia").value,
    data_inicio: document.getElementById("data_inicio").value,
    data_expiracao: document.getElementById("data_expiracao").value
  };

  const url = garantiaId
    ? `http://localhost:5000/api/garantias/editarGarantia/${garantiaId}`
    : "http://localhost:5000/api/garantias/criarGarantia";

  const method = garantiaId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(garantiaData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Erro ao salvar garantia: ${errorData.message || response.statusText}`);
      return;
    }

    alert(garantiaId ? "Garantia atualizada com sucesso!" : "Garantia criada com sucesso!");

    formGarantia.classList.add("oculto");
    form.reset();
    document.getElementById("garantia_id").value = ""; // limpa id após salvar
    carregarGarantias();

  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro ao salvar garantia. Tente novamente.");
  }
});

// Popular tabela com as garantias
function popularTabela(listaGarantias) {
  if (!listaGarantias || listaGarantias.length === 0) {
    tabelaGarantias.innerHTML = `<tr><td colspan="7">Nenhuma garantia encontrada.</td></tr>`;
    return;
  }

  let html = "";

  listaGarantias.forEach(g => {
    const cliente = g.cliente?.nome || "-";
    const produto = g.produto?.nome || "-";
    const pacote = g.pacote_garantia || "-";
    const status = g.status_garantia || "-";

    const dataInicio = g.data_inicio
      ? new Date(g.data_inicio).toLocaleDateString('pt-BR')
      : "-";
    const dataExpiracao = g.data_expiracao
      ? new Date(g.data_expiracao).toLocaleDateString('pt-BR')
      : "-";

    html += `
      <tr>
        <td>${cliente}</td>
        <td>${produto}</td>
        <td>${pacote}</td>
        <td>${dataInicio}</td>
        <td>${dataExpiracao}</td>
        <td>${status}</td>
        <td>
          <button class="editar" data-id="${g.id}" title="Editar garantia">
            <svg class="icon icon-editar" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.06 9.02l.92.92L7.92 17H7v-.92l7.06-7.06M17.66 3c-.26 0-.52.1-.71.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34A1 1 0 0 0 17.66 3M14.06 6.94L4 17v3h3l10.06-10.06-3-3z"/>
            </svg>
          </button>
          <button class="deletar" data-id="${g.id}" title="Deletar garantia">
            <svg class="icon icon-deletar" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zm3.46-9.12 1.41-1.41L12 10.59l1.12-1.12 1.41 1.41L13.41 12l1.12 1.12-1.41 1.41L12 13.41l-1.12 1.12-1.41-1.41L10.59 12l-1.12-1.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </td>
      </tr>
    `;
  });

  tabelaGarantias.innerHTML = html;

  // Eventos deletar
  document.querySelectorAll(".deletar").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const garantiaId = e.currentTarget.getAttribute("data-id");

      if (!confirm("Tem certeza que deseja deletar esta garantia?")) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Acesso negado! Faça login.");
        window.location.href = "./Login.html";
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/garantias/excluirGarantia/${garantiaId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(`Erro ao deletar garantia: ${errorData.message || res.statusText}`);
          return;
        }

        carregarGarantias();

      } catch (error) {
        console.error("Erro ao deletar garantia:", error);
        alert("Erro ao deletar garantia. Tente novamente.");
      }
    });
  });

  // Eventos editar
  adicionarEventoEditar();
}

// Preencher formulário com dados para edição
function preencherFormularioEdicao(garantia) {
  formGarantia.classList.remove("oculto");
  form.reset();

  document.getElementById("garantia_id").value = garantia.id;
  document.getElementById("user_id").value = garantia.user_id || garantia.cliente?.id || "";
  document.getElementById("produto_id").value = garantia.produto_id || garantia.produto?.id || "";
  document.getElementById("pacote_garantia").value = garantia.pacote_garantia || "";
  document.getElementById("status_garantia").value = garantia.status_garantia || "";
  document.getElementById("data_inicio").value = garantia.data_inicio ? garantia.data_inicio.split('T')[0] : "";
  document.getElementById("data_expiracao").value = garantia.data_expiracao ? garantia.data_expiracao.split('T')[0] : "";
}

// Adicionar evento editar para botões da tabela
function adicionarEventoEditar() {
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const garantiaId = btn.getAttribute("data-id");
      const garantia = garantiasCarregadas.find(g => g.id == garantiaId);
      if (!garantia) {
        alert("Garantia não encontrada para edição.");
        return;
      }
      preencherFormularioEdicao(garantia);
    });
  });
}

// Carregar garantias para tabela
async function carregarGarantias() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  tabelaGarantias.innerHTML = `<tr><td colspan="7">Carregando garantias...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/garantias/listarGarantias", {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tabelaGarantias.innerHTML = `<tr><td colspan="7">Erro ao carregar garantias</td></tr>`;
      return;
    }

    const data = await res.json();

    garantiasCarregadas = data.garantias || [];

    if (garantiasCarregadas.length === 0) {
      tabelaGarantias.innerHTML = `<tr><td colspan="7">Nenhuma garantia encontrada.</td></tr>`;
      return;
    }

    popularTabela(garantiasCarregadas);

  } catch (err) {
    console.error(err);
    tabelaGarantias.innerHTML = `<tr><td colspan="7">Erro ao carregar garantias</td></tr>`;
  }
}

// Filtrar garantias pela busca
const inputBuscaGarantia = document.getElementById("pesquisa-garantia");

inputBuscaGarantia.addEventListener("input", () => {
  const termo = inputBuscaGarantia.value.trim().toLowerCase();

  if (!termo) {
    popularTabela(garantiasCarregadas);
    return;
  }

  const filtrados = garantiasCarregadas.filter(g => {
    const cliente = g.cliente?.nome?.toLowerCase() || "";
    const produto = g.produto?.nome?.toLowerCase() || "";
    const pacote = g.pacote_garantia?.toLowerCase() || "";
    const status = g.status_garantia?.toLowerCase() || "";
    const dataInicio = g.data_inicio ? new Date(g.data_inicio).toLocaleDateString('pt-BR').toLowerCase() : "";
    const dataExpiracao = g.data_expiracao ? new Date(g.data_expiracao).toLocaleDateString('pt-BR').toLowerCase() : "";

    return (
      cliente.includes(termo) ||
      produto.includes(termo) ||
      pacote.includes(termo) ||
      status.includes(termo) ||
      dataInicio.includes(termo) ||
      dataExpiracao.includes(termo)
    );
  });

  popularTabela(filtrados);
});

// Inicialização
carregarClientes();
carregarProdutos();
carregarGarantias();
