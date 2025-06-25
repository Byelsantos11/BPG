// Sair 
const sair = document.getElementById("sair");
sair.addEventListener("click", () => {
  sair.textContent = "Saindo...";
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "./Login.html";
  }, 1000);
});

// Vriáveis 
const btnNovoProduto = document.getElementById("btn-novo-produto");
const formProduto = document.getElementById("form-produto");
const cancelar = document.getElementById("cancelar");
const form = document.getElementById("produto-form");
const lista = document.getElementById("tabela-produtos");
const buscaInput = document.getElementById("pesquisa-produto");

let produtosCarregados = [];
let idProdutoEditando = null;

// variável de edição 
const formEditar = document.getElementById("form-cliente-editar");
const formEditarEl = document.getElementById("cliente-form-editar");
const cancelarEditar = document.getElementById("cancelarEditar");

// Abrir formulário
btnNovoProduto.addEventListener("click", () => {
  formProduto.classList.remove("oculto");
  form.reset();
});

cancelar.addEventListener("click", () => {
  formProduto.classList.add("oculto");
  form.reset();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  const produto = {
    nome: document.getElementById("nome").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    preco: Number(document.getElementById("preco").value),
    estoque: Number(document.getElementById("estoque").value),
    descricao: document.getElementById("descricao").value,
    categoria: document.getElementById("categoria").value,
  };

  //Requisição criar produtos
  try {
    const res = await fetch("http://localhost:5000/api/produtos/criarProduto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(produto),
    });

    if (res.ok) {
      alert("Produto cadastrado com sucesso!");
      formProduto.classList.add("oculto");
      form.reset();
      carregarProdutos();
    } else {
      const erro = await res.json();
      alert(`Erro ao salvar produto: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
});

// Edição variável 
function preencherFormularioEdicao(produto) {
  document.getElementById("nomeEditar").value = produto.nome;
  document.getElementById("descricaoEditar").value = produto.descricao;
  document.getElementById("marcaEditar").value = produto.marca;
  document.getElementById("modeloEditar").value = produto.modelo;
  document.getElementById("categoriaEditar").value = produto.categoria;
  document.getElementById("precoEditar").value = produto.preco;
  document.getElementById("estoqueEditar").value = produto.estoque;
  idProdutoEditando = produto.id;
  formEditar.classList.remove("oculto");
}

//Fechar tela de edição
cancelarEditar.addEventListener("click", () => {
  formEditar.classList.add("oculto");
  formEditarEl.reset();
  idProdutoEditando = null;
});

formEditarEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token || !idProdutoEditando) return alert("Usuário não autenticado!");

  const produtoEditado = {
    nome: document.getElementById("nomeEditar").value,
    descricao: document.getElementById("descricaoEditar").value,
    marca: document.getElementById("marcaEditar").value,
    modelo: document.getElementById("modeloEditar").value,
    categoria: document.getElementById("categoriaEditar").value,
    preco: Number(document.getElementById("precoEditar").value),
    estoque: Number(document.getElementById("estoqueEditar").value),
  };

  try {
    const res = await fetch(`http://localhost:5000/api/produtos/editarProduto/${idProdutoEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(produtoEditado),
    });

    if (res.ok) {
      alert("Produto editado com sucesso!");
      formEditar.classList.add("oculto");
      formEditarEl.reset();
      carregarProdutos();
    } else {
      const erro = await res.json();
      alert(`Erro ao editar produto: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro ao se conectar ao servidor.");
    console.error(erro);
  }
});

// Tabela
function popularTabela(produtos) {
  if (!produtos || produtos.length === 0) {
    lista.innerHTML = "<tr><td colspan='7'>Nenhum produto encontrado.</td></tr>";
    return;
  }

  lista.innerHTML = "";
  produtos.forEach((produto) => {
    lista.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.descricao}</td>
        <td>${produto.marca} - ${produto.modelo}</td>
        <td>${produto.categoria}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.estoque}</td>
        <td>
          <button class="editar" data-id="${produto.id}" title="Editar produto">✏️</button>
          <button class="deletar" data-id="${produto.id}" title="Deletar produto">🗑️</button>
        </td>
      </tr>
    `;
  });

  // Eventos de deletar
  document.querySelectorAll(".deletar").forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = botao.getAttribute("data-id");
      if (confirm("Tem certeza que deseja deletar este produto?")) {
        deletarProduto(id);
      }
    });
  });

  // Eventos de editar
  document.querySelectorAll(".editar").forEach((botao) => {
    botao.addEventListener("click", () => {
      const id = Number(botao.getAttribute("data-id")); // <-- CORREÇÃO AQUI
      const produto = produtosCarregados.find(p => p.id === id);
      if (produto) preencherFormularioEdicao(produto);
    });
  });
}

// Deletar produtos 
async function deletarProduto(id) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  try {
    const res = await fetch(`http://localhost:5000/api/produtos/excluirProduto/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (res.ok) {
      carregarProdutos();
    } else {
      const erro = await res.json();
      alert(`Erro ao deletar produto: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro ao se conectar ao servidor.");
    console.error(erro);
  }
}

// Carregar Produtos
async function carregarProdutos() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  try {
    const res = await fetch("http://localhost:5000/api/produtos/listaProduto", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erro ao carregar produtos.");
      return;
    }

    const data = await res.json();
    produtosCarregados = data.produtos || [];
    popularTabela(produtosCarregados);
  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
}

// Busca 
if (buscaInput) {
  buscaInput.addEventListener("input", () => {
    const termo = buscaInput.value.toLowerCase();

    const produtosFiltrados = produtosCarregados.filter((produto) => {
      return (
        (produto.nome ?? "").toLowerCase().includes(termo) ||
        (produto.descricao ?? "").toLowerCase().includes(termo) ||
        (produto.marca ?? "").toLowerCase().includes(termo) ||
        (produto.modelo ?? "").toLowerCase().includes(termo) ||
        (produto.categoria ?? "").toLowerCase().includes(termo)
      );
    });

    popularTabela(produtosFiltrados);
  });
}

// Iniciar
carregarProdutos();
