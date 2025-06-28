const sair = document.getElementById("sair");

// Evento de sair
sair.addEventListener("click", () => {
  sair.textContent = "Saindo...";
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "./Login.html";
  }, 1000);
});

// Variáveis formulário novo cliente
const btnNovoCliente = document.getElementById("btn-novo-cliente");
const formCliente = document.getElementById("form-cliente");
const cancelar = document.getElementById("cancelar");
const form = document.getElementById("cliente-form");

// Variáveis formulário editar cliente
const formClienteEditar = document.getElementById("form-cliente-editar");
const formEditar = document.getElementById("cliente-form-editar");
const cancelarEditar = document.getElementById("cancelarEditar");

const lista = document.getElementById("tabela-clientes");
const inputPesquisa = document.getElementById("pesquisa");

let clientesCache = [];
let clienteIdEditar = null; // Guarda o id do cliente que está sendo editado

// Mostrar formulário novo cliente
btnNovoCliente.addEventListener("click", () => {
  formCliente.classList.remove("oculto");
  formClienteEditar.classList.add("oculto");
  form.reset();
});

// Cancelar formulário novo cliente
cancelar.addEventListener("click", () => {
  formCliente.classList.add("oculto");
  form.reset();
});

// Cancelar formulário editar cliente
cancelarEditar.addEventListener("click", () => {
  formClienteEditar.classList.add("oculto");
  formEditar.reset();
  clienteIdEditar = null;
});

// Enviar formulário novo cliente
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado!");
    return;
  }

  //Objeto cliente 
  const cliente = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
    cidade: document.getElementById("cidade").value,
    estado: document.getElementById("estado").value,
  };

  //Requisição cria Cliente (fetch)
  try {
    const res = await fetch("http://localhost:5000/api/clientes/criarCliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(cliente),
    });

    if (res.ok) {
      alert("Cliente cadastrado com sucesso!");
      formCliente.classList.add("oculto");
      form.reset();
      carregarClientes();
    } else {
      const erro = await res.json();
      alert(`Erro ao salvar cliente: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
});

// Enviar formulário editar cliente
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!clienteIdEditar) {
    alert("Nenhum cliente selecionado para editar.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado!");
    return;
  }

  //Objeto Cliente editar
  const clienteEditado = {
    nome: document.getElementById("nomeEditar").value,
    email: document.getElementById("emailEditar").value,
    telefone: document.getElementById("telefoneEditar").value,
    endereco: document.getElementById("enderecoEditar").value,
    cidade: document.getElementById("cidadeEditar").value,
    estado: document.getElementById("estadoEditar").value,
  };

  //Requisição editar Cliente (fetch)
  try {
    const res = await fetch(
      `http://localhost:5000/api/clientes/editarCliente/${clienteIdEditar}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clienteEditado),
      }
    );

    //Verificaçao if else para retorno de menssagem
    if (res.ok) {
      alert("Cliente atualizado com sucesso!");
      formClienteEditar.classList.add("oculto");
      formEditar.reset();
      clienteIdEditar = null;
      carregarClientes();
    } else {
      const erro = await res.json();
      alert(`Erro ao atualizar cliente: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
});

// Exibir clientes na tabela
function exibirClientes(listaClientes) {
  if (listaClientes.length === 0) {
    lista.innerHTML =
      "<tr><td colspan='5'>Nenhum cliente encontrado.</td></tr>";
    return;
  }

  lista.innerHTML = "";
  listaClientes.forEach((cliente) => {
    lista.innerHTML += `
      <tr>
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.endereco} - ${cliente.cidade}</td>
        <td>
          <button class="editar" data-id="${cliente.id}" title="Editar cliente">
            ✏️
          </button>

          <button class="deletar" data-id="${cliente.id}" title="Deletar cliente">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });

  // Eventos dos botões deletar
  document.querySelectorAll(".deletar").forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("data-id");
      if (confirm("Tem certeza que deseja deletar este cliente?")) {
        deletarUsuario(id).then(() => carregarClientes());
      }
    });
  });

  // Eventos dos botões editar
  document.querySelectorAll(".editar").forEach((botao) => {
    botao.addEventListener("click", (e) => {
      const id = botao.getAttribute("data-id");
      clienteIdEditar = id;

      // Pega a linha <tr> do botão clicado
      const linha = e.target.closest("tr");
      const tds = linha.querySelectorAll("td");

      const nome = tds[0].textContent.trim();
      const email = tds[1].textContent.trim();
      const telefone = tds[2].textContent.trim();
      const enderecoCidade = tds[3].textContent.trim();
      const [endereco, cidade] = enderecoCidade.split(" - ").map((item) => item.trim());

      // Preenche inputs do form editar
      document.getElementById("nomeEditar").value = nome;
      document.getElementById("emailEditar").value = email;
      document.getElementById("telefoneEditar").value = telefone;
      document.getElementById("enderecoEditar").value = endereco || "";
      document.getElementById("cidadeEditar").value = cidade || "";

      // Mostra o formulário de edição e esconde o de novo cliente
      formClienteEditar.classList.remove("oculto");
      formCliente.classList.add("oculto");
    });
  });
}

// Função para carregar clientes do backend
async function carregarClientes() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login novamente.");
    return;
  }

  lista.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

  try {
    const res = await fetch("http://localhost:5000/api/clientes/listaCliente", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      lista.innerHTML = "<tr><td colspan='5'>Erro ao buscar clientes</td></tr>";
      return;
    }

    const data = await res.json();
    clientesCache = data.clientes || [];

    exibirClientes(clientesCache);
  } catch (erro) {
    lista.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados</td></tr>";
    console.error(erro);
  }
}

// Pesquisa clientes pelo termo digitado
inputPesquisa.addEventListener("input", () => {
  const termo = inputPesquisa.value.toLowerCase().trim();

  const clientesFiltrados = clientesCache.filter((cliente) => {
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo) ||
      cliente.telefone.toLowerCase().includes(termo)
    );
  });

  exibirClientes(clientesFiltrados);
});

// Carrega clientes ao abrir a página
carregarClientes();

// Função para deletar cliente
async function deletarUsuario(id) {
  const token = localStorage.getItem("token");

  //Requisição excluir Cliente (fetch)
  try {
    const res = await fetch(`http://localhost:5000/api/clientes/excluirCliente/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erro ao deletar usuário!");
    }
  } catch (error) {
    console.error("Erro: " + error);
    alert("Erro na conexão com o servidor!");
  }
}
